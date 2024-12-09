package services

import (
	"database/sql"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func CheckResumeCreator(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, _ := c.Get("userID")
		idStr := c.Param("id")
		id, _ := strconv.ParseInt(idStr, 10, 64)

		fmt.Print(userID, id)

		query := `SELECT EXISTS(SELECT 1 FROM "Resume" WHERE "id" = $1 AND "creator_id" = $2)`
		var isCreator bool

		err := db.QueryRow(query, id, userID).Scan(&isCreator)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Помилка запиту до бази даних"})
			c.Abort()
			return
		}

		if !isCreator {
			c.JSON(http.StatusForbidden, gin.H{"error": "Forbidden"})
			c.Abort()
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "OK"})
		c.Next()
	}
}
