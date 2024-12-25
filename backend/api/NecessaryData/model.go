package necessarydata

import (
	"database/sql"

	"github.com/gofiber/fiber/v2"
)

func (ne *NecessaryData) GetKeywords(c *fiber.Ctx, db *sql.DB) error {
	var keywords Keywords

	query := `SELECT array_agg(name) AS keywords
		FROM (
			SELECT name
			FROM "Keyword"
			ORDER BY random()
		) AS random_keywords`

	queryRows, err := db.Query(query)
	if err != nil {
		return err
	}

	for queryRows.Next() {
		err := queryRows.Scan(&keywords.Keywords)
		if err != nil {
			return err
		}
	}

	return c.Status(fiber.StatusOK).JSON(keywords)
}
