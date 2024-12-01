package api

import (
	"database/sql"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

type Job struct {
	ID              uint           `json:"id"`
	CreatorID       uint           `json:"creator_id"`
	Title           string         `json:"title"`
	Description     string         `json:"description"`
	Requirements    string         `json:"requirements"`
	Offer           string         `json:"offer"`
	CategoryName    string         `json:"category_name"`
	SubcategoryName *string        `json:"subcategory_name"`
	CityName        *string        `json:"city_name"`
	Experience      float64        `json:"experience"`
	EmploymentName  string         `json:"employment_name"`
	SalaryFrom      *uint          `json:"salary_from"`
	SalaryTo        *uint          `json:"salary_to"`
	CreatedAt       time.Time      `json:"created_at"`
	UpdatedAt       time.Time      `json:"updated_at"`
	CompanyID       uint           `json:"company_id"`
	CompanyName     string         `json:"company_name"`
	AboutUs         string         `json:"about_us"`
	ImageUrl        string         `json:"image_url"`
	WebSite         string         `json:"website"`
	Status          sql.NullString `json:"status"`
}

func GetJobs(c *gin.Context, db *sql.DB) {
	search := c.Query("search")
	category := c.Query("category")
	subcategory := c.Query("subcategory")
	experience := c.Query("experience")
	employment := c.Query("employment")
	city := c.Query("city")
	salary_from := c.Query("salary_from")
	salary_to := c.Query("salary_to")
	// userRole, _ := c.Get("userRole")
	userID, _ := c.Get("userID")
	var jobs []Job

	query := (`
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
			ja.status
		) AS status
	FROM "Job" j
	LEFT JOIN "Category" c ON j.category_id = c.ID
	LEFT JOIN "Subcategory" s ON j.subcategory_id = s.ID
	LEFT JOIN "City" ct ON j.city_id = ct.ID
	LEFT JOIN "Employment" e ON j.employment_id = e.ID
	LEFT JOIN "User" u ON j.creator_id = u.ID
	LEFT JOIN "Company" co ON u.ID = co.recruiter_id
	LEFT JOIN "ResumeApplication" ra ON ra.job_id = j.ID AND ra.candidate_id = $1
	LEFT JOIN "JobApplication" ja ON ja.job_id = j.ID AND ja.candidate_id = $1
	WHERE TRUE`)

	var queryParams []interface{}
	queryParams = append(queryParams, userID)

	// if userRole == "CANDIDATE" {
	// 	query += ` AND (a.candidate_id = $2 OR a.candidate_id IS NULL)`
	// } else {
	// 	query += ` AND a.candidate_id IS NULL`
	// }

	argID := 2

	if search != "" {
		query += ` AND (
			j.title ILIKE '%' || $` + strconv.Itoa(argID) + ` || '%' 
			OR c.Name ILIKE '%' || $` + strconv.Itoa(argID) + ` || '%'
			OR s.Name ILIKE '%' || $` + strconv.Itoa(argID) + ` || '%'
			OR co.company_name ILIKE '%' || $` + strconv.Itoa(argID) + ` || '%'
		)`
		queryParams = append(queryParams, search)
		argID++
	}

	if category != "" {
		query += ` AND c.Name ILIKE $` + strconv.Itoa(argID)
		queryParams = append(queryParams, category)
		argID++
	}

	if subcategory != "" {
		query += ` AND s.Name ILIKE $` + strconv.Itoa(argID)
		queryParams = append(queryParams, subcategory)
		argID++
	}

	if experience != "" {
		query += ` AND j.Experience = $` + strconv.Itoa(argID)
		queryParams = append(queryParams, experience)
		argID++
	}

	if employment != "" {
		query += ` AND e.Name = $` + strconv.Itoa(argID)
		queryParams = append(queryParams, employment)
		argID++
	}

	if city != "" {
		if city == "Вся Україна" {
			return
		} else {
			query += ` AND ct.Name = $` + strconv.Itoa(argID)
			queryParams = append(queryParams, city)
			argID++
		}
	}

	if salary_from != "" {
		if salary_from == "0" {
			return
		}
		query += ` AND (j.salary_from >= $` + strconv.Itoa(argID) + ` OR j.salary_to >= $` + strconv.Itoa(argID) + `)`
		queryParams = append(queryParams, salary_from)
		argID++
	}

	if salary_to != "" {
		query += ` AND (j.salary_from <= $` + strconv.Itoa(argID) + ` OR j.salary_to <= $` + strconv.Itoa(argID) + `)`
		queryParams = append(queryParams, salary_to)
		argID++
	}

	query += ` ORDER BY j.ID DESC
	LIMIT 15`

	rows, err := db.Query(query, queryParams...)
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
			&job.SalaryFrom, &job.SalaryTo, &job.CreatedAt, &job.UpdatedAt, &job.CompanyID, &job.CompanyName, &job.AboutUs, &job.ImageUrl, &job.WebSite, &job.Status)
		if err != nil {
			log.Printf("Error scanning row: %v, Data: %+v\n", err, job)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error scanning jobs"})
			return
		}
		jobs = append(jobs, job)
	}

	c.JSON(http.StatusOK, jobs)
}
