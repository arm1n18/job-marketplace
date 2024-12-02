package services

import (
	"database/sql"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
)

func AuthMiddleware(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		if err := godotenv.Load(".env"); err != nil {
			log.Fatalf("Ошибка загрузки .env файла: %v", err)
		}

		secretKey := os.Getenv("SECRET_KEY")

		accessToken := c.GetHeader("Authorization")
		if accessToken == "" {
			c.Next()
			return
		}

		accessToken = strings.Replace(accessToken, "Bearer ", "", 1)

		claims := &jwt.MapClaims{}
		token, err := jwt.ParseWithClaims(accessToken, claims, func(token *jwt.Token) (interface{}, error) {
			return []byte(secretKey), nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			c.Abort()
			return
		}

		userID := (*claims)["id"].(float64)
		userEmail := (*claims)["email"].(string)
		userRole := (*claims)["role"].(string)
		exp := (*claims)["exp"].(float64)

		if time.Now().After(time.Unix(int64(exp), 0)) || time.Until(time.Unix(int64(exp), 0)) < 5*time.Minute {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token is about to expire"})
			c.Abort()
			return
		}

		query := `SELECT EXISTS(SELECT 1 FROM "User" WHERE "id" = $1 AND "email" = $2 AND "role" = $3)`
		var exists bool

		err = db.QueryRow(query, userID, userEmail, userRole).Scan(&exists)

		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			c.Abort()
			return
		}

		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			c.Abort()
			return
		}

		c.Set("userID", userID)
		c.Set("userRole", userRole)
		c.Next()
	}
}
