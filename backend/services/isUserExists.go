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

	// if userRole == "RECRUITER" {
	// 	query = `SELECT "company_name", "phone_number", "recruiter_name", "about_us", "avatar_url" FROM "Company" WHERE "user_id" = $1`
	// 	companyName, phoneNumber, recuiterName, aboutUs, avatarURL := "", "", "", "", ""
	// 	err = db.QueryRow(query, userID).Scan(&companyName, &phoneNumber, &recuiterName, &aboutUs, &avatarURL)
	// 	if err != nil {
	// 		return 0, "", err
	// 	}
	// } else if userRole == "CANDIDATE" {
	// 	query = `SELECT "name", "avatar_url" FROM "Candidate" WHERE "user_id" = $1`
	// 	err = db.QueryRow(query, userID).Scan(&userRole, &userRole)
	// 	if err != nil {
	// 		return 0, "", err
	// 	}
	// }

	err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	if err != nil {
		return 0, "", err
	}

	return userID, userRole, nil
}
