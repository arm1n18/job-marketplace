package handlers

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type SearchParams struct {
	Page        int
	Search      string
	Category    string
	Subcategory string
	Experience  string
	Employment  string
	City        string
	Salary      string
}

func GetSearchParams(c *fiber.Ctx) SearchParams {
	page := 1

	if p := c.Query("page"); p != "" {
		queryPage, err := strconv.Atoi(p)
		if err == nil {
			if queryPage < 1 {
				page = 1
			}
			if queryPage > 0 {
				page = queryPage
			}
		}
	}

	return SearchParams{
		Page:        page,
		Search:      c.Query("search"),
		Category:    c.Query("category"),
		Subcategory: c.Query("subcategory"),
		Experience:  c.Query("experience"),
		Employment:  c.Query("employment"),
		City:        c.Query("city"),
		Salary:      c.Query("salary_from"),
	}
}
