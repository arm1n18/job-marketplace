package services

import (
	"backend/database"
	"database/sql"
	"errors"

	_ "github.com/lib/pq"
)

func CheckValidUser(db *sql.DB, email string, role database.Role) (bool, error) {
	exists, _ := IsEmailExist(db, email)
	if exists {
		return false, errors.New("Користувач з таким email вже існує")
	}

	if !IsCorrectRole(role) {
		return false, errors.New("Недопустимая роль")
	}

	return true, nil
}
