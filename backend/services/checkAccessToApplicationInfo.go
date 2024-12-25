package services

import (
	"database/sql"
	"net/http"

	"github.com/gofiber/fiber/v2"
)

func CheckAccessToApplicationInfo(db *sql.DB) func(*fiber.Ctx) error {
	return func(c *fiber.Ctx) error {
		userID := c.Locals("userID")
		userRole := c.Locals("userRole")

		var access bool
		var query string
		if userRole == "CANDIDATE" {
			query = `SELECT EXISTS 
				(SELECT 1 FROM "JobApplication" WHERE "candidate_id" = $1 AND "status" = 'SUCCEEDED' AND "id" = $2)`
		} else if userRole == "RECRUITER" {
			query = `SELECT EXISTS 
			(SELECT 1 FROM "ResumeApplication" WHERE "recruiter_id" = $1 AND "status" = 'SUCCEEDED' AND "id" = $2)`
		}

		err := db.QueryRow(query, userID, c.Params("id")).Scan(&access)
		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		if !access {
			return c.Status(http.StatusForbidden).JSON(fiber.Map{
				"error": "Forbidden",
			})
		}

		return c.Next()
	}
}
