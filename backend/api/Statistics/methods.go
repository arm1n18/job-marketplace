package statistics

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"os"

	"github.com/gofiber/fiber/v2"
)

func (r *Report) GetStatistics(c *fiber.Ctx, db *sql.DB) error {
	jsonFile, err := os.ReadFile("statistics/statistics.json")
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	var report Report
	err = json.Unmarshal(jsonFile, &report)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Ошибка при обработке JSON: " + err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(report)
}
