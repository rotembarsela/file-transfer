package api

import (
	"fmt"
	"net/http"
)

func ProtectedHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("userID").(uint)
	fmt.Fprintf(w, "Welcome User ID: %d, to the protected route!\n", userID)
}
