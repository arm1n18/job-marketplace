package services

import (
	"database/sql"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
)

func AuthMiddleware(db *sql.DB) func(*fiber.Ctx) error {
	return func(c *fiber.Ctx) error {
		if err := godotenv.Load(".env"); err != nil {
			log.Fatalf("Ошибка загрузки .env файла: %v", err)
		}

		secretKey := os.Getenv("SECRET_KEY")

		accessToken := c.Get("Authorization")

		if accessToken == "" {
			return c.Next()
		}

		accessToken = strings.Replace(accessToken, "Bearer ", "", 1)

		claims := &jwt.MapClaims{}
		token, err := jwt.ParseWithClaims(accessToken, claims, func(token *jwt.Token) (interface{}, error) {
			return []byte(secretKey), nil
		})

		if err != nil || !token.Valid {
			return c.Status(http.StatusUnauthorized).JSON(fiber.Map{
				"error": "Unauthorized",
			})
		}

		userID := (*claims)["id"].(float64)
		userEmail := (*claims)["email"].(string)
		userRole := (*claims)["role"].(string)
		exp := (*claims)["exp"].(float64)

		if time.Now().After(time.Unix(int64(exp), 0)) || time.Until(time.Unix(int64(exp), 0)) < 5*time.Minute {
			return c.Status(http.StatusUnauthorized).JSON(fiber.Map{
				"error": "Token is about to expire",
			})
		}

		query := `SELECT EXISTS(SELECT 1 FROM "User" WHERE "id" = $1 AND "email" = $2 AND "role" = $3)`
		var exists bool

		err = db.QueryRow(query, userID, userEmail, userRole).Scan(&exists)

		if err != nil {
			return c.Status(http.StatusUnauthorized).JSON(fiber.Map{
				"error": "Unauthorized",
			})
		}

		if !exists {
			return c.Status(http.StatusUnauthorized).JSON(fiber.Map{
				"error": "Unauthorized",
			})
		}

		c.Locals("userID", userID)
		c.Locals("userRole", userRole)
		return c.Next()
	}
}
