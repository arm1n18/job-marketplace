package services

import (
	"backend/database"
	"log"
	"os"
	"time"

	jwt "github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
)

func CreateToken(userId int, userEmail string, userRole database.Role, createRefresh bool) (string, string, error) {
	if err := godotenv.Load(".env"); err != nil {
		log.Fatalf("Ошибка загрузки .env файла: %v", err)
	}

	secretKey := os.Getenv("SECRET_KEY")

	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":    userId,
		"email": userEmail,
		"role":  userRole,
		"exp":   time.Now().Add(time.Minute * 30).Unix(),
		"iat":   time.Now().Unix(),
	})

	accessTokenString, err := accessToken.SignedString([]byte(secretKey))
	if err != nil {
		return "", "", err
	}

	var refreshTokenString string

	if createRefresh {
		refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"id":    userId,
			"email": userEmail,
			"role":  userRole,
			"exp":   time.Now().Add(time.Hour * 24 * 30).Unix(),
			"iat":   time.Now().Unix(),
		})

		refreshTokenString, err = refreshToken.SignedString([]byte(secretKey))

		if err != nil {
			return "", "", err
		}
	}

	return accessTokenString, refreshTokenString, nil
}
