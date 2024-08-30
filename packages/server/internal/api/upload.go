package api

import (
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/rotembarsela/file-transfer/internal/models"
)

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
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"download_link": downloadLink})
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

func generateHash(filename string, timestamp time.Time) string {
	hasher := sha256.New()
	hasher.Write([]byte(fmt.Sprintf("%s-%d", filename, timestamp.Unix())))
	return hex.EncodeToString(hasher.Sum(nil))
}
