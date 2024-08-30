package api

import (
	"database/sql"
	"fmt"
	"net/http"
	"time"

	"github.com/rotembarsela/file-transfer/internal/models"
)

func FetchFileHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := r.URL.Query().Get("id")
		if id == "" {
			http.Error(w, "File ID is required", http.StatusBadRequest)
			return
		}

		var metadata models.FileMetadata
		query := `
			SELECT id, filename, filepath, upload_time, expiry_time, hash 
			FROM files WHERE id = $1
		`
		err := db.QueryRow(query, id).Scan(&metadata.ID, &metadata.FileName, &metadata.FilePath, &metadata.UploadTime, &metadata.ExpiryTime, &metadata.Hash)
		if err != nil {
			if err == sql.ErrNoRows {
				http.Error(w, "File not found", http.StatusNotFound)
			} else {
				http.Error(w, "Server error", http.StatusInternalServerError)
			}
			return
		}

		// Check if the file has expired
		if time.Now().After(metadata.ExpiryTime) {
			http.Error(w, "Link Expired", http.StatusNotFound)
			return
		}

		// Serve the file using its hashed path but provide the original filename
		w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"", metadata.FileName))
		http.ServeFile(w, r, metadata.FilePath)
	}
}
