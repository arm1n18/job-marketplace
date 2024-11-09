package services

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func UpdateResume(c *gin.Context) {
	// сделать
}

func CheckExistResume(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var exists bool

		userID, _ := c.Get("userID")
		log.Print(userID)

		query := `SELECT EXISTS(SELECT 1 FROM "Resume" WHERE "creator_id" = $1)`
		err := db.QueryRow(query, userID).Scan(&exists)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Помилка запиту до бази даних"})
			return
		}

		if exists {
			c.JSON(http.StatusConflict, gin.H{"message": "Резюме вже існує!"})
			c.Abort()
			return
		}

		c.Next()
	}
}
