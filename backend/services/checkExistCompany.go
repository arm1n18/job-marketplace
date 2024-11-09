package services

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
)

func UpdateCompany(c *gin.Context) {
	// сделать
}

func CheckExistCompany(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var exists bool

		recruiterID := c.DefaultPostForm("recruiter_id", "")

		query := `SELECT EXISTS(SELECT 1 FROM "Company" WHERE "recruiter_id" = $1)`
		err := db.QueryRow(query, recruiterID).Scan(&exists)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Помилка запиту до бази даних"})
			return
		}

		if exists {
			c.JSON(http.StatusConflict, gin.H{"message": "Компанія вже існує!"})
			c.Abort()
			return
		}

		c.Next()
	}
}
