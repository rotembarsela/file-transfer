package models

import (
	"fmt"
	"time"
)

type FileMetadataReduced struct {
	FileName   string    `json:"fileName"`
	UploadTime time.Time `json:"uploadTime"`
	ExpiryTime time.Time `json:"expiryTime"`
}

type FileMetadata struct {
	ID         int
	FileName   string
	FilePath   string
	UploadTime time.Time
	ExpiryTime time.Time
	Hash       string
}

var FileStore = map[string]FileMetadata{}

func PrintFileStore() {
	fmt.Println("Files in FileStore:")

	for hash, metadata := range FileStore {
		fmt.Printf("Hash: %s\n", hash)
		fmt.Printf("FileName: %s\n", metadata.FileName)
		fmt.Printf("FilePath: %s\n", metadata.FilePath)
		fmt.Printf("UploadTime: %s\n", metadata.UploadTime)
		fmt.Printf("ExpiryTime: %s\n", metadata.ExpiryTime)
		fmt.Printf("----\n")
	}
}
