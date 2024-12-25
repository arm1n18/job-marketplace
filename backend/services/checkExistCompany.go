package services

import (
	"database/sql"
	"net/http"

	"github.com/gofiber/fiber/v2"
)

func CheckExistCompany(db *sql.DB) func(*fiber.Ctx) error {
	return func(c *fiber.Ctx) error {
		var exists bool

		recruiterID := c.FormValue("recruiter_id")

		query := `SELECT EXISTS(SELECT 1 FROM "Company" WHERE "recruiter_id" = $1)`
		err := db.QueryRow(query, recruiterID).Scan(&exists)
		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Помилка запиту до бази даних"})
		}

		if exists {
			return c.Status(http.StatusConflict).JSON(fiber.Map{"error": "Компанія вже існує!"})
		}

		return c.Next()
	}
}
