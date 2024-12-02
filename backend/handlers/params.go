package handlers

import "github.com/gin-gonic/gin"

type SearchParams struct {
	Search      string
	Category    string
	Subcategory string
	Experience  string
	Employment  string
	City        string
	Salary      string
}

func GetSearchParams(c *gin.Context) SearchParams {
	return SearchParams{
		Search:      c.Query("search"),
		Category:    c.Query("category"),
		Subcategory: c.Query("subcategory"),
		Experience:  c.Query("experience"),
		Employment:  c.Query("employment"),
		City:        c.Query("city"),
		Salary:      c.Query("salary_from"),
	}
}
