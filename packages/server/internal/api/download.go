package api

import (
	"net/http"
	"path/filepath"
	"time"

	"github.com/rotembarsela/file-transfer/internal/models"
)

func DownloadLinkHandler(w http.ResponseWriter, r *http.Request) {
	hash := r.URL.Query().Get("hash")
	if hash == "" {
		http.Error(w, "Invalid Link", http.StatusBadRequest)
		return
	}

	fileMetadata, exists := models.FileStore[hash]
	if !exists || time.Now().After(fileMetadata.ExpiryTime) {
		http.Error(w, "Link Expired or Invalid", http.StatusNotFound)
		return
	}

	http.ServeFile(w, r, filepath.Join("uploaded_files", fileMetadata.FileName))
}
