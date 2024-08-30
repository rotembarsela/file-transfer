package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"

	_ "github.com/lib/pq"
	"github.com/rotembarsela/file-transfer/internal/api"
	"github.com/rotembarsela/file-transfer/internal/middleware"
)

func main() {
	databaseUrl := os.Getenv("DATABASE_URL")
	if databaseUrl == "" {
		log.Fatal("DATABASE_URL is not set")
	}

	db, err := sql.Open("postgres", databaseUrl)
	if err != nil {
		log.Fatalf("Failed to connect to the database: %v", err)
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		log.Fatalf("Failed to ping the database: %v", err)
	}

	log.Println("Successfully connected to the database!")

	mux := http.NewServeMux()

	mux.HandleFunc("/register", api.RegisterHandler(db))
	mux.HandleFunc("/login", api.LoginHandler(db))
	mux.HandleFunc("/files", api.FetchAllFilesHandler(db))
	mux.HandleFunc("/files/", api.FetchFileHandler(db))
	mux.HandleFunc("/files/delete/", api.DeleteFileHandler(db))
	mux.HandleFunc("/upload", api.UploadFileHandler(db))
	mux.HandleFunc("/download", api.DownloadLinkHandler(db))
	mux.Handle("/protected", middleware.AuthMiddleware(http.HandlerFunc(api.ProtectedHandler(db))))

	log.Println("Server started on :8080")
	log.Fatal(http.ListenAndServe(":8080", mux))
}
