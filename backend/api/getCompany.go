package api

import (
	"database/sql"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

type Company struct {
	ID          uint   `json:"id"`
	RecruiterID uint   `json:"recruiter_id"`
	CompanyName string `json:"company_name"`
	AboutUs     string `json:"about_us"`
	ImageUrl    string `json:"image_url"`
	WebSite     string `json:"website"`
	LinkedIn    string `json:"linkedin"`
	Facebook    string `json:"facebook"`
}

func GetCompany(c *gin.Context, db *sql.DB) {
	search := c.Query("search")
	category := c.Query("category")
	subcategory := c.Query("subcategory")
	experience := c.Query("experience")
	employment := c.Query("employment")
	name := c.Param("name")
	city := c.Query("city")
	salary_from := c.Query("salary_from")
	userID, _ := c.Get("userID")

	var company Company
	var jobs []Job

	if strings.Contains(name, " ") || strings.Contains(name, "%20") {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Имя компании не должно содержать пробелы"})
		return
	}

	companyName := strings.ReplaceAll(name, "-", " ")

	query := `
	SELECT
	    co.ID AS CompanyID, co.company_name AS CompanyName,
		co.about_us AS AboutUs, co.image_url AS ImageUrl, co.web_site AS WebSite,
		co.linkedin AS LinkedIn, co.facebook AS Facebook
	FROM "Company" co
	WHERE LOWER(co.company_name) = LOWER($1)
	`

	row := db.QueryRow(query, companyName)
	err := row.Scan(&company.ID, &company.CompanyName, &company.AboutUs, &company.ImageUrl, &company.WebSite, &company.LinkedIn, &company.Facebook)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Company not found"})
			return
		}
		log.Printf("Ошибка выполнения запроса: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Помилка запиту до бази даних"})
		return
	}

	jobsQuery := (`
	SELECT
		j.ID, j.creator_id, j.Title, j.Description, j.Requirements, j.Offer,
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
		LEFT JOIN "ResumeApplication" ra ON ra.job_id = j.ID AND ra.candidate_id = $2
		LEFT JOIN "JobApplication" a ON a.job_id = j.ID AND a.candidate_id = $2
		WHERE co.ID = $1 AND TRUE
	`)
	var queryParams []any
	queryParams = append(queryParams, company.ID, userID)

	argID := 3

	if search != "" {
		jobsQuery += ` AND (
			j.title ILIKE '%' || $` + strconv.Itoa(argID) + ` || '%' 
			OR c.Name ILIKE '%' || $` + strconv.Itoa(argID) + ` || '%'
			OR s.Name ILIKE '%' || $` + strconv.Itoa(argID) + ` || '%'
			OR co.company_name ILIKE '%' || $` + strconv.Itoa(argID) + ` || '%'
		)`
		queryParams = append(queryParams, search)
		argID++
	}

	if category != "" {
		jobsQuery += ` AND c.Name = $` + strconv.Itoa(argID)
		queryParams = append(queryParams, category)
		argID++
	}

	if subcategory != "" {
		jobsQuery += ` AND s.Name = $` + strconv.Itoa(argID)
		queryParams = append(queryParams, subcategory)
		argID++
	}

	if experience != "" {
		jobsQuery += ` AND j.Experience = $` + strconv.Itoa(argID)
		queryParams = append(queryParams, experience)
		argID++
	}

	if employment != "" {
		jobsQuery += ` AND e.Name = $` + strconv.Itoa(argID)
		queryParams = append(queryParams, employment)
		argID++
	}

	if city != "" {
		jobsQuery += ` AND ct.Name = $` + strconv.Itoa(argID)
		queryParams = append(queryParams, city)
		argID++
	}

	if salary_from != "" {
		jobsQuery += ` AND (j.salary_from >= $` + strconv.Itoa(argID) + ` OR j.salary_to >= $` + strconv.Itoa(argID) + `)`
		queryParams = append(queryParams, salary_from)
		argID++
	}

	jobsQuery += ` ORDER BY j.ID DESC
	LIMIT 15`

	rows, err := db.Query(jobsQuery, queryParams...)

	if err != nil {
		log.Printf("Ошибка выполнения запроса: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Помилка запиту до бази даних"})
		return
	}
	defer rows.Close()

	for rows.Next() {
		job := Job{}
		err := rows.Scan(&job.ID, &job.CreatorID, &job.Title, &job.Description, &job.Requirements, &job.Offer,
			&job.CategoryName, &job.SubcategoryName, &job.CityName, &job.Experience, &job.EmploymentName,
			&job.SalaryFrom, &job.SalaryTo, &job.CreatedAt, &job.UpdatedAt, &job.CompanyID, &job.CompanyName,
			&job.AboutUs, &job.ImageUrl, &job.WebSite, &job.Status)
		if err != nil {
			log.Printf("Error scanning row: %v, Data: %+v\n", err, job)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error scanning jobs"})
			return
		}
		jobs = append(jobs, job)
	}

	c.JSON(http.StatusOK, gin.H{
		"company": company,
		"jobs":    jobs,
	})
}
