package services

import (
	"database/sql"

	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

func IsUserExists(db *sql.DB, email string, password string) (int, string, error) {
	var userID int
	var userRole, hashedPassword string
	query := `SELECT ID, "role", "password" FROM "User" WHERE "email" = $1`
	err := db.QueryRow(query, email).Scan(&userID, &userRole, &hashedPassword)
	if err != nil {
		return 0, "", err
	}

	err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	if err != nil {
		return 0, "", err
	}

	return userID, userRole, nil
}
