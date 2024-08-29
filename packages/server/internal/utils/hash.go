package utils

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"time"
)

func GenerateHash(input string) string {
	hasher := sha256.New()
	hasher.Write([]byte(input))
	return hex.EncodeToString(hasher.Sum(nil))
}

func GenerateUniqueLink(fileID string, expiration time.Duration) string {
	timestamp := time.Now().Add(expiration).Unix()
	data := fmt.Sprintf("%s:%d", fileID, timestamp)
	return GenerateHash(data)
}
