package api

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"time"
)

func generateHash(filename string, timestamp time.Time) string {
	hasher := sha256.New()
	hasher.Write([]byte(fmt.Sprintf("%s-%d", filename, timestamp.Unix())))
	return hex.EncodeToString(hasher.Sum(nil))
}
