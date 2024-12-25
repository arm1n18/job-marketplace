package services

import (
	"database/sql"
	"log"
	"net/http"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func CheckJobCreator(db *sql.DB) func(*fiber.Ctx) error {
	return func(c *fiber.Ctx) error {
		userID := c.Locals("userID")
		idStr := c.Params("id")
		id, _ := strconv.ParseInt(idStr, 10, 64)

		log.Print(userID, id)

		query := `SELECT EXISTS(SELECT 1 FROM "Job" WHERE "id" = $1 AND "creator_id" = $2 AND "inactive" = FALSE)`
		var isCreator bool

		err := db.QueryRow(query, id, userID).Scan(&isCreator)

		if err != nil {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"error": "Помилка запиту до бази даних",
			})
		}

		if !isCreator {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"error": "Forbidden",
			})
		}

		c.JSON(fiber.Map{
			"message": "OK",
		})
		return c.Next()
	}
}
