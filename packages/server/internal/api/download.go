package api

import (
	"database/sql"
	"fmt"
	"net/http"
	"strconv"
	"time"
)

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
