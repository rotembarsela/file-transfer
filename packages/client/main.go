package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
)

type UploadResponse struct {
	FileID       int    `json:"fileId"`
	DownloadLink string `json:"download_link"`
}

func uploadFile(url, filePath string) (*UploadResponse, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	var body bytes.Buffer
	writer := multipart.NewWriter(&body)

	part, err := writer.CreateFormFile("file", filepath.Base(file.Name()))
	if err != nil {
		return nil, err
	}
	_, err = io.Copy(part, file)
	if err != nil {
		return nil, err
	}

	err = writer.Close()
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequest("POST", url, &body)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", writer.FormDataContentType())

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var uploadResp UploadResponse
	err = json.Unmarshal(respBody, &uploadResp)
	if err != nil {
		return nil, fmt.Errorf("failed to parse upload response: %w", err)
	}

	fmt.Println("Upload Response:", uploadResp)

	return &uploadResp, nil
}

func fetchAllFiles(url string) error {
	resp, err := http.Get(url)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	fmt.Println("Fetch All Files Response:", string(respBody))
	return nil
}

func fetchFileByID(url string, id int) error {
	reqURL := fmt.Sprintf("%s/%d", url, id)
	resp, err := http.Get(reqURL)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	if resp.StatusCode == http.StatusNotFound {
		fmt.Println("File not found or link expired.")
		return nil
	} else if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	fmt.Println("Fetch File Response:", string(respBody))
	return nil
}

func deleteFileByID(url string, id int) error {
	reqURL := fmt.Sprintf("%s/%d", url, id)
	req, err := http.NewRequest("DELETE", reqURL, nil)
	if err != nil {
		return err
	}

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	fmt.Println("Delete File Response:", string(respBody))
	return nil
}

func main() {
	baseURL := "http://localhost:8080"

	uploadResp, err := uploadFile(baseURL+"/upload", "./assets/customers_example.xlsx")
	if err != nil {
		fmt.Println("Error uploading file:", err)
		return
	}

	err = fetchAllFiles(baseURL + "/files")
	if err != nil {
		fmt.Println("Error fetching all files:", err)
		return
	}

	fileID := uploadResp.FileID
	err = fetchFileByID(baseURL+"/files", fileID)
	if err != nil {
		fmt.Println("Error fetching file by ID:", err)
		return
	}

	err = deleteFileByID(baseURL+"/files/delete", fileID)
	if err != nil {
		fmt.Println("Error deleting file:", err)
		return
	}
}
