package api

import (
	"database/sql"
	"fmt"
	"net/http"
)

func ProtectedHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID, ok := r.Context().Value("userID").(uint)
		if !ok {
			http.Error(w, "User ID not found in context", http.StatusUnauthorized)
			return
		}

		// Optional: Use the userID to perform database queries
		// For example, you might want to fetch the user's details from the database
		// var userName string
		// err := db.QueryRow("SELECT username FROM users WHERE id = $1", userID).Scan(&userName)
		// if err != nil {
		//     http.Error(w, "Could not retrieve user information", http.StatusInternalServerError)
		//     return
		// }

		fmt.Fprintf(w, "Welcome User ID: %d, to the protected route!\n", userID)

		// If you fetched additional data from the database, you could include it in the response
		// fmt.Fprintf(w, "Welcome %s (User ID: %d), to the protected route!\n", userName, userID)
	}
}
