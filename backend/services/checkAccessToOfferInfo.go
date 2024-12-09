package services

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CheckAccessToOfferInfo(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, _ := c.Get("userID")
		userRole, _ := c.Get("userRole")

		var access bool
		var query string
		if userRole == "CANDIDATE" {
			query = `SELECT EXISTS 
				(SELECT 1 FROM "ResumeApplication" WHERE "candidate_id" = $1 AND "status" = 'SUCCEEDED' AND "id" = $2)`
		} else if userRole == "RECRUITER" {
			query = `SELECT EXISTS 
			(SELECT 1 FROM "JobApplication" WHERE "recruiter_id" = $1 AND "status" = 'SUCCEEDED' AND "id" = $2)`
		}

		err := db.QueryRow(query, userID, c.Param("id")).Scan(&access)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}

		if !access {
			c.JSON(http.StatusForbidden, gin.H{"error": "Forbidden"})
			c.Abort()
		}

		c.Next()
	}

}
