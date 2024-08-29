package config

import (
	"os"
	"time"
)

var JWTSecret = []byte(os.Getenv("JWT_SECRET"))

const TokenExpiryDuration = time.Hour * 24
