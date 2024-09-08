package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	_ "github.com/lib/pq"
	"github.com/rotembarsela/file-transfer/internal/api"
	"github.com/rotembarsela/file-transfer/internal/middleware"
)

func main() {
	databaseUrl := os.Getenv("DATABASE_URL")
	if databaseUrl == "" {
		log.Fatal("DATABASE_URL is not set")
	}

	db, err := connectWithRetry(databaseUrl, 10, 2*time.Second)
	if err != nil {
		log.Fatalf("Failed to connect to the database: %v", err)
	}
	defer db.Close()

	log.Println("Successfully connected to the database!")

	mux := http.NewServeMux()

	registerRoutes(mux, db)

	log.Println("Server started on :8080")
	log.Fatal(http.ListenAndServe(":8080", middleware.CorsMiddleware(mux)))
}

func connectWithRetry(databaseUrl string, maxRetries int, delay time.Duration) (*sql.DB, error) {
	var db *sql.DB
	var err error

	for i := 0; i < maxRetries; i++ {
		db, err = sql.Open("postgres", databaseUrl)
		if err != nil {
			log.Printf("Attempt %d: Failed to open database connection: %v", i+1, err)
			time.Sleep(delay)
			continue
		}

		err = db.Ping()
		if err == nil {
			return db, nil
		}

		log.Printf("Attempt %d: Failed to ping the database: %v", i+1, err)
		time.Sleep(delay)
	}

	return nil, fmt.Errorf("could not connect to the database after %d attempts: %w", maxRetries, err)
}

func registerRoutes(mux *http.ServeMux, db *sql.DB) {
	apiMux := http.NewServeMux()

	apiMux.HandleFunc("/register", api.RegisterHandler(db))
	apiMux.HandleFunc("/login", api.LoginHandler(db))
	apiMux.HandleFunc("/files", api.FetchAllFilesHandler(db))
	apiMux.HandleFunc("/files/", api.FetchFileHandler(db))
	apiMux.HandleFunc("/files/delete/", api.DeleteFileHandler(db))
	apiMux.HandleFunc("/upload", api.UploadFileHandler(db))
	apiMux.HandleFunc("/download", api.DownloadLinkHandler(db))
	apiMux.Handle("/protected", middleware.AuthMiddleware(http.HandlerFunc(api.ProtectedHandler(db))))

	mux.Handle("/api/", http.StripPrefix("/api", apiMux))
}
