package main

import (
	"log"
	"net/http"

	"github.com/rotembarsela/file-transfer/internal/api"
	"github.com/rotembarsela/file-transfer/internal/middleware"
)

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/login", api.LoginHandler)
	mux.HandleFunc("/upload", api.UploadFileHandler)
	mux.HandleFunc("/download", api.DownloadLinkHandler)

	mux.Handle("/protected", middleware.AuthMiddleware(http.HandlerFunc(api.ProtectedHandler)))

	log.Println("Server started on :8080")
	log.Fatal(http.ListenAndServe(":8080", mux))
}
