package services

import (
	"database/sql"
	"net/http"

	"github.com/gofiber/fiber/v2"
)

func CheckExistResume(db *sql.DB) func(*fiber.Ctx) error {
	return func(c *fiber.Ctx) error {
		var exists bool

		userID := c.Locals("userID")

		query := `SELECT EXISTS(SELECT 1 FROM "Resume" WHERE "creator_id" = $1)`
		err := db.QueryRow(query, userID).Scan(&exists)
		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"error": "Помилка запиту до бази даних",
			})
		}

		if exists {
			return c.Status(http.StatusConflict).JSON(fiber.Map{
				"message": "Резюме вже існує!",
			})
		}

		return c.Next()
	}
}
