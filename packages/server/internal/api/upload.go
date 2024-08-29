package api

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/rotembarsela/file-transfer/internal/models"
)

func UploadFileHandler(w http.ResponseWriter, r *http.Request) {
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

	filePath := filepath.Join(uploadDir, handler.Filename)

	dst, err := os.Create(filePath)
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
		FilePath:   filePath,
		UploadTime: time.Now(),
		ExpiryTime: time.Now().Add(24 * time.Hour),
		Hash:       hash,
	}
	models.FileStore[hash] = fileMetadata

	models.PrintFileStore()

	downloadLink := fmt.Sprintf("http://localhost:8080/download?hash=%s", hash)
	w.Header().Set("Content-Type", "application/json")
	fmt.Fprintf(w, `{"download_link": "%s"}`, downloadLink)
}

func generateHash(filename string, timestamp time.Time) string {
	hasher := sha256.New()
	hasher.Write([]byte(fmt.Sprintf("%s-%d", filename, timestamp.Unix())))
	return hex.EncodeToString(hasher.Sum(nil))
}
