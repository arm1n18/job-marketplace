package services

import (
	"database/sql"

	_ "github.com/lib/pq"
)

func IsEmailExist(db *sql.DB, email string) (bool, error) {
	var exists bool
	query := `SELECT EXISTS(SELECT 1 FROM "User" WHERE "email" = $1)`
	err := db.QueryRow(query, email).Scan(&exists)
	if err != nil {
		return false, err
	}
	return exists, nil
}
