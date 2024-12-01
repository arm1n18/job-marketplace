package api

import (
	"database/sql"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

func GetJob(c *gin.Context, db *sql.DB) {
	var job Job
	userID, _ := c.Get("userID")
	idStr := c.Param("id")
	id, _ := strconv.ParseInt(idStr, 10, 64)

	query := `
	SELECT j.ID, j.creator_id, j.Title, j.Description, j.Requirements, j.Offer,
		c.Name AS CategoryName,
		s.Name AS SubcategoryName,
		ct.Name AS CityName,
		j.Experience, e.Name AS EmploymentName,
		j.salary_from, j.salary_to, j.created_at, j.updated_at,
		co.ID AS CompanyID, co.company_name AS CompanyName,
		co.about_us AS AboutUs, co.image_url AS ImageUrl, co.web_site AS WebSite,
			COALESCE(
				ra.status,
				a.status
			) AS status
	FROM "Job" j
	LEFT JOIN "Category" c ON j.category_id = c.ID
	LEFT JOIN "Subcategory" s ON j.subcategory_id = s.ID
	LEFT JOIN "City" ct ON j.city_id = ct.ID
	LEFT JOIN "Employment" e ON j.employment_id = e.ID
	LEFT JOIN "User" u ON j.creator_id = u.ID
	LEFT JOIN "Company" co ON u.ID = co.recruiter_id
	LEFT JOIN "ResumeApplication" ra ON ra.job_id = j.ID AND ra.candidate_id = $1
	LEFT JOIN "JobApplication" a ON a.job_id = j.ID AND a.candidate_id = $1
	WHERE j.ID = $2
	`

	row := db.QueryRow(query, userID, id)
	err := row.Scan(&job.ID, &job.CreatorID, &job.Title, &job.Description, &job.Requirements, &job.Offer,
		&job.CategoryName, &job.SubcategoryName, &job.CityName, &job.Experience, &job.EmploymentName,
		&job.SalaryFrom, &job.SalaryTo, &job.CreatedAt, &job.UpdatedAt,
		&job.CompanyID, &job.CompanyName, &job.AboutUs, &job.ImageUrl, &job.WebSite, &job.Status)

	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Job not found"})
			return
		}
		log.Printf("Ошибка выполнения запроса: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Помилка запиту до бази даних"})
		return
	}

	c.JSON(http.StatusOK, job)
}
