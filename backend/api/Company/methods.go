package company

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"

	job "backend/api/Job"
	media "backend/api/UploadMedia"

	"backend/handlers"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

func (co *CompanyResponse) GetCompanyInfo(c *gin.Context, db *sql.DB) {
	var company Company
	params := handlers.GetSearchParams(c)
	name := c.Param("name")
	userID, _ := c.Get("userID")

	var jobs []job.Job

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
		log.Printf("Помилка виконання запиту: %v\n", err)
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

	if params.Search != "" {
		jobsQuery += ` AND (
			j.title ILIKE '%' || $` + strconv.Itoa(argID) + ` || '%' 
			OR c.Name ILIKE '%' || $` + strconv.Itoa(argID) + ` || '%'
			OR s.Name ILIKE '%' || $` + strconv.Itoa(argID) + ` || '%'
			OR co.company_name ILIKE '%' || $` + strconv.Itoa(argID) + ` || '%'
		)`
		queryParams = append(queryParams, params.Search)
		argID++
	}

	if params.Category != "" {
		jobsQuery += ` AND c.Name = $` + strconv.Itoa(argID)
		queryParams = append(queryParams, params.Category)
		argID++
	}

	if params.Subcategory != "" {
		jobsQuery += ` AND s.Name = $` + strconv.Itoa(argID)
		queryParams = append(queryParams, params.Subcategory)
		argID++
	}

	if params.Experience != "" {
		jobsQuery += ` AND j.Experience = $` + strconv.Itoa(argID)
		queryParams = append(queryParams, params.Experience)
		argID++
	}

	if params.Employment != "" {
		jobsQuery += ` AND e.Name = $` + strconv.Itoa(argID)
		queryParams = append(queryParams, params.Employment)
		argID++
	}

	if params.City != "" {
		jobsQuery += ` AND ct.Name = $` + strconv.Itoa(argID)
		queryParams = append(queryParams, params.City)
		argID++
	}

	if params.Salary != "" {
		jobsQuery += ` AND (j.salary_from >= $` + strconv.Itoa(argID) + ` OR j.salary_to >= $` + strconv.Itoa(argID) + `)`
		queryParams = append(queryParams, params.Salary)
		argID++
	}

	jobsQuery += ` ORDER BY j.ID DESC
	LIMIT 15`

	rows, err := db.Query(jobsQuery, queryParams...)

	if err != nil {
		log.Printf("Помилка виконання запиту: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Помилка запиту до бази даних"})
		return
	}
	defer rows.Close()

	for rows.Next() {
		job := job.Job{}
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

func (co *CompanyResponse) GetCompanyJobsList(c *gin.Context, db *sql.DB) {
	var jobs []job.Job
	userID, _ := c.Get("userID")

	jobsQuery := (`
	SELECT
		j.ID, j.creator_id, j.Title, j.Description,
		c.Name AS CategoryName,
		s.Name AS SubcategoryName,
		ct.Name AS CityName,
		j.Experience, e.Name AS EmploymentName,
		j.salary_from, j.salary_to, j.created_at, j.updated_at,
		co.ID AS CompanyID, co.company_name AS CompanyName,
		co.image_url AS ImageUrl
	FROM "Job" j
	LEFT JOIN "Category" c ON j.category_id = c.ID
	LEFT JOIN "Subcategory" s ON j.subcategory_id = s.ID
	LEFT JOIN "City" ct ON j.city_id = ct.ID
	LEFT JOIN "Employment" e ON j.employment_id = e.ID
	LEFT JOIN "User" u ON j.creator_id = u.ID
	LEFT JOIN "Company" co ON u.ID = co.recruiter_id
	WHERE j.creator_id = $1
	`)

	rows, err := db.Query(jobsQuery, userID)

	if err != nil {
		log.Printf("Помилка виконання запиту: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Помилка запиту до бази даних"})
		return
	}
	defer rows.Close()

	for rows.Next() {
		job := job.Job{}
		err := rows.Scan(&job.ID, &job.CreatorID, &job.Title, &job.Description,
			&job.CategoryName, &job.SubcategoryName, &job.CityName, &job.Experience, &job.EmploymentName,
			&job.SalaryFrom, &job.SalaryTo, &job.CreatedAt, &job.UpdatedAt, &job.CompanyID, &job.CompanyName, &job.ImageUrl)
		if err != nil {
			log.Printf("Error scanning row: %v, Data: %+v\n", err, job)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error scanning jobs"})
			return
		}
		jobs = append(jobs, job)
	}

	c.JSON(http.StatusOK, jobs)
}

func (co *CompanyResponse) CreateCompany(c *gin.Context, db *sql.DB) {
	recruiterID := c.DefaultPostForm("recruiter_id", "")
	recruiterName := c.DefaultPostForm("recruiter_name", "")
	companyName := c.DefaultPostForm("company_name", "")
	aboutUs := c.DefaultPostForm("about_us", "")
	website := c.DefaultPostForm("web_site", "")
	linkedin := c.DefaultPostForm("linkedin", "")
	facebook := c.DefaultPostForm("facebook", "")
	phone := c.DefaultPostForm("phone", "")

	log.Printf("Received data: recruiterID=%s, recruiterName=%s, companyName=%s", recruiterID, recruiterName, companyName)

	avatarFile, err := c.FormFile("avatar")
	var avatarURL string
	if err != nil && err.Error() != "http: no such file" {
		log.Printf("Error processing avatar file: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process avatar file"})
		return
	}

	if avatarFile != nil {
		log.Printf("Uploading avatar for company: %s", companyName)
		avatarURL, err = media.UploadPhoto(avatarFile, companyName)
		if err != nil {
			log.Printf("Failed to upload photo to S3: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to upload photo to S3: %v", err)})
			return
		}
	}

	phoneNumber, err := strconv.Atoi(phone)
	if err != nil {
		log.Printf("Invalid phone number format: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid phone number format"})
		return
	}

	query := `INSERT INTO "Company" ("recruiter_id", "company_name", "about_us", "image_url", 
        "web_site", "linkedin", "facebook", "phone_number", "recruiter_name", "created_at", "updated_at")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW()) RETURNING "id"`

	var companyID uint
	log.Printf("Executing query to insert company into database: %s", companyName)
	err = db.QueryRow(query, recruiterID, companyName, aboutUs, avatarURL, website, linkedin, facebook, phoneNumber, recruiterName).Scan(&companyID)
	if err != nil {
		log.Printf("Error inserting company into database: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Error inserting company into database: %v", err)})
		return
	}

	log.Printf("Company created successfully with ID: %d", companyID)

	c.JSON(http.StatusOK, gin.H{
		"message":    "Company created successfully",
		"avatar_url": avatarURL,
	})
}
