package services

import (
	"database/sql"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func CheckResumeCreator(db *sql.DB) func(*fiber.Ctx) error {
	return func(c *fiber.Ctx) error {
		userID := c.Locals("userID")
		idStr := c.Params("id")
		id, _ := strconv.ParseInt(idStr, 10, 64)

		fmt.Print(userID, id)

		query := `SELECT EXISTS(SELECT 1 FROM "Resume" WHERE "id" = $1 AND "creator_id" = $2)`
		var isCreator bool

		err := db.QueryRow(query, id, userID).Scan(&isCreator)

		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"error": "Помилка запиту до бази даних",
			})
		}

		if !isCreator {
			return c.Status(http.StatusForbidden).JSON(fiber.Map{
				"error": "Forbidden",
			})
		}

		return c.Next()
	}
}
