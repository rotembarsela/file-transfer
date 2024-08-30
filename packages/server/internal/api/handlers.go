package api

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/rotembarsela/file-transfer/internal/auth"
	"github.com/rotembarsela/file-transfer/internal/models"
	"golang.org/x/crypto/bcrypt"
)

type RegisterRequest struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

func RegisterHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
			return
		}

		var req RegisterRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request payload", http.StatusBadRequest)
			return
		}

		if strings.TrimSpace(req.Username) == "" || strings.TrimSpace(req.Email) == "" || strings.TrimSpace(req.Password) == "" {
			http.Error(w, "Username, email, and password are required", http.StatusBadRequest)
			return
		}

		var existingUserID uint
		err := db.QueryRow("SELECT id FROM users WHERE username=$1 OR email=$2", req.Username, req.Email).Scan(&existingUserID)
		if err == nil {
			http.Error(w, "Username or email already exists", http.StatusConflict)
			return
		} else if err != sql.ErrNoRows {
			http.Error(w, "Server error", http.StatusInternalServerError)
			fmt.Println("Error checking existing user:", err)
			return
		}

		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			http.Error(w, "Failed to hash password", http.StatusInternalServerError)
			fmt.Println("Error hashing password:", err)
			return
		}

		_, err = db.Exec("INSERT INTO users (username, email, password) VALUES ($1, $2, $3)", req.Username, req.Email, string(hashedPassword))
		if err != nil {
			http.Error(w, "Failed to register user", http.StatusInternalServerError)
			fmt.Println("Error inserting new user:", err)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		fmt.Fprintln(w, `{"message": "User registered successfully"}`)
	}
}

type loginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func LoginHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
			return
		}

		var req loginRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request payload", http.StatusBadRequest)
			return
		}

		var userID uint
		var hashedPassword string
		err := db.QueryRow("SELECT id, password FROM users WHERE username=$1", req.Username).Scan(&userID, &hashedPassword)
		if err != nil {
			if err == sql.ErrNoRows {
				http.Error(w, "Invalid username or password", http.StatusUnauthorized)
			} else {
				http.Error(w, "Server error", http.StatusInternalServerError)
			}
			return
		}

		err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(req.Password))
		if err != nil {
			http.Error(w, "Invalid username or password", http.StatusUnauthorized)
			return
		}

		token, err := auth.GenerateJWT(userID)
		if err != nil {
			http.Error(w, "Could not generate token", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"token": token})
	}
}

func saveFileMetadata(db *sql.DB, metadata models.FileMetadata) (int, error) {
	query := `
		INSERT INTO files (filename, filepath, upload_time, expiry_time, hash)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id
	`
	var fileID int
	err := db.QueryRow(query, metadata.FileName, metadata.FilePath, metadata.UploadTime, metadata.ExpiryTime, metadata.Hash).Scan(&fileID)
	return fileID, err
}

func UploadFileHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := r.ParseMultipartForm(10 << 20)
		if err != nil {
			http.Error(w, fmt.Sprintf("Error parsing form: %v", err), http.StatusBadRequest)
			return
		}

		file, handler, err := r.FormFile("file")
		if err != nil {
			http.Error(w, "Error Retrieving the File", http.StatusInternalServerError)
			return
		}
		defer file.Close()

		uploadDir := "./uploaded_files"
		err = os.MkdirAll(uploadDir, os.ModePerm)
		if err != nil {
			http.Error(w, "Error Creating Directory", http.StatusInternalServerError)
			return
		}

		hash := generateHash(handler.Filename, time.Now())
		hashedFilePath := filepath.Join(uploadDir, hash)

		dst, err := os.Create(hashedFilePath)
		if err != nil {
			http.Error(w, "Error Saving the File", http.StatusInternalServerError)
			return
		}
		defer dst.Close()

		if _, err := io.Copy(dst, file); err != nil {
			http.Error(w, "Error Saving the File", http.StatusInternalServerError)
			return
		}

		fileMetadata := models.FileMetadata{
			FileName:   handler.Filename,
			FilePath:   hashedFilePath,
			UploadTime: time.Now(),
			ExpiryTime: time.Now().Add(24 * time.Hour),
			Hash:       hash,
		}

		fileID, err := saveFileMetadata(db, fileMetadata)
		if err != nil {
			http.Error(w, "Error saving file metadata", http.StatusInternalServerError)
			return
		}

		downloadLink := fmt.Sprintf("http://localhost:8080/download?id=%d", fileID)

		response := map[string]interface{}{
			"download_link": downloadLink,
			"fileId":        fileID,
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	}
}

func DownloadLinkHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idStr := r.URL.Query().Get("id")
		if idStr == "" {
			http.Error(w, "File ID is required", http.StatusBadRequest)
			return
		}

		id, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "Invalid File ID", http.StatusBadRequest)
			return
		}

		var fileName, filePath string
		var expiryTime time.Time
		query := `
			SELECT filename, filepath, expiry_time 
			FROM files 
			WHERE id = $1
		`
		err = db.QueryRow(query, id).Scan(&fileName, &filePath, &expiryTime)
		if err != nil {
			if err == sql.ErrNoRows {
				http.Error(w, "File not found", http.StatusNotFound)
			} else {
				http.Error(w, "Server error", http.StatusInternalServerError)
			}
			return
		}

		if time.Now().After(expiryTime) {
			http.Error(w, "Link Expired", http.StatusNotFound)
			return
		}

		w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"", fileName))

		http.ServeFile(w, r, filePath)
	}
}

func FetchAllFilesHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		query := `SELECT id, filename, filepath, upload_time, expiry_time, hash FROM files`
		rows, err := db.Query(query)
		if err != nil {
			http.Error(w, "Server error while fetching files", http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		files := []models.FileMetadata{}

		for rows.Next() {
			var file models.FileMetadata
			err := rows.Scan(&file.ID, &file.FileName, &file.FilePath, &file.UploadTime, &file.ExpiryTime, &file.Hash)
			if err != nil {
				http.Error(w, "Error scanning file data", http.StatusInternalServerError)
				return
			}
			files = append(files, file)
		}

		if err := rows.Err(); err != nil {
			http.Error(w, "Error reading file data", http.StatusInternalServerError)
			return
		}

		fmt.Printf("Fetched Files: %+v\n", files)

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(files)
	}
}

func FetchFileHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		path := strings.TrimPrefix(r.URL.Path, "/files/")
		idStr := strings.TrimSpace(path)

		id, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "Invalid File ID format", http.StatusBadRequest)
			return
		}

		var metadata models.FileMetadata
		query := `
			SELECT id, filename, filepath, upload_time, expiry_time, hash 
			FROM files WHERE id = $1
		`
		err = db.QueryRow(query, id).Scan(&metadata.ID, &metadata.FileName, &metadata.FilePath, &metadata.UploadTime, &metadata.ExpiryTime, &metadata.Hash)
		if err != nil {
			if err == sql.ErrNoRows {
				http.Error(w, "File not found", http.StatusNotFound)
			} else {
				http.Error(w, "Server error", http.StatusInternalServerError)
			}
			return
		}

		if time.Now().After(metadata.ExpiryTime) {
			http.Error(w, "Link Expired", http.StatusNotFound)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(metadata)
	}
}

func DeleteFileHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		path := strings.TrimPrefix(r.URL.Path, "/files/delete/")
		idStr := strings.TrimSpace(path)

		id, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "Invalid File ID format", http.StatusBadRequest)
			return
		}

		var filePath string
		query := `SELECT filepath FROM files WHERE id = $1`
		err = db.QueryRow(query, id).Scan(&filePath)
		if err != nil {
			if err == sql.ErrNoRows {
				http.Error(w, "File not found", http.StatusNotFound)
			} else {
				http.Error(w, "Server error", http.StatusInternalServerError)
			}
			return
		}

		if err := os.Remove(filePath); err != nil {
			http.Error(w, "Failed to delete file", http.StatusInternalServerError)
			return
		}

		_, err = db.Exec(`DELETE FROM files WHERE id = $1`, id)
		if err != nil {
			http.Error(w, "Failed to delete file record", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		fmt.Fprintln(w, "File deleted successfully")
	}
}

func ProtectedHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID, ok := r.Context().Value("userID").(uint)
		if !ok {
			http.Error(w, "User ID not found in context", http.StatusUnauthorized)
			return
		}

		// Optional: Use the userID to perform database queries
		// For example, you might want to fetch the user's details from the database
		// var userName string
		// err := db.QueryRow("SELECT username FROM users WHERE id = $1", userID).Scan(&userName)
		// if err != nil {
		//     http.Error(w, "Could not retrieve user information", http.StatusInternalServerError)
		//     return
		// }

		fmt.Fprintf(w, "Welcome User ID: %d, to the protected route!\n", userID)

		// If you fetched additional data from the database, you could include it in the response
		// fmt.Fprintf(w, "Welcome %s (User ID: %d), to the protected route!\n", userName, userID)
	}
}
