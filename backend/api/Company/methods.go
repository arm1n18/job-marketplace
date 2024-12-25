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

	"github.com/gofiber/fiber/v2"
	_ "github.com/lib/pq"
)

func (co *CompanyResponse) GetCompaniesList(c *fiber.Ctx, db *sql.DB) error {
	var companies []CompaniesList
	params := handlers.GetSearchParams(c)

	query := `SELECT 
		co.ID AS CompanyID, co.company_name AS CompanyName,
		co.about_us AS AboutUs, co.image_url AS ImageUrl,
		COUNT(j.id) AS TotalJobs,
		CASE 
        	WHEN COUNT(j.id) > 0 THEN AVG((j.salary_from + j.salary_to) / 2.0)
        ELSE 0
    END AS AvgSalary
	FROM "Company" co
	LEFT JOIN "Job" j ON co.ID = j.company_id
	WHERE TRUE
	`

	var queryParams []interface{}

	if params.Search != "" {
		query += `AND (co.company_name ILIKE '%' || $1 || '%')`
		queryParams = append(queryParams, params.Search)
	}

	query += `GROUP BY co.ID`

	rows, err := db.Query(query, queryParams...)
	if err != nil {
		log.Printf("Помилка виконання запиту: %v\n", err)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Помилка запиту до бази даних"})
	}
	defer rows.Close()

	for rows.Next() {
		company := CompaniesList{}
		err := rows.Scan(&company.ID, &company.CompanyName, &company.AboutUs, &company.ImageUrl,
			&company.TotalJobs, &company.AverageSalary)
		if err != nil {
			log.Printf("Error scanning row: %v, Data: %+v\n", err, company)
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Error scanning companies"})
		}
		companies = append(companies, company)
	}

	return c.Status(fiber.StatusOK).JSON(companies)
}

func (co *CompanyResponse) GetCompanyInfo(c *fiber.Ctx, db *sql.DB) error {
	var company Company
	params := handlers.GetSearchParams(c)
	name := c.Params("name")
	userID := c.Locals("userID")

	var jobs []job.Job

	if strings.Contains(name, " ") || strings.Contains(name, "%20") {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": "Имя компании не должно содержать пробелы",
		})
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
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"error": "Company not found",
			})
		}
		log.Printf("Помилка виконання запиту: %v\n", err)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": "Помилка запиту до бази даних",
		})
	}

	jobsQuery := (`
	SELECT
		j.ID, j.creator_id, j.Title, j.Description, j.Requirements, j.Offer,
		c.Name AS CategoryName,
		s.Name AS SubcategoryName,
		j.key_words,
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
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": "Помилка запиту до бази даних",
		})
	}
	defer rows.Close()

	for rows.Next() {
		job := job.Job{}
		err := rows.Scan(&job.ID, &job.CreatorID, &job.Title, &job.Description, &job.Requirements, &job.Offer,
			&job.CategoryName, &job.SubcategoryName, &job.Keywords, &job.CityName, &job.Experience, &job.EmploymentName,
			&job.SalaryFrom, &job.SalaryTo, &job.CreatedAt, &job.UpdatedAt, &job.CompanyID, &job.CompanyName,
			&job.AboutUs, &job.ImageUrl, &job.WebSite, &job.Status)
		if err != nil {
			log.Printf("Error scanning row: %v, Data: %+v\n", err, job)
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"error": "Error scanning jobs",
			})
		}
		jobs = append(jobs, job)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"company": company,
		"jobs":    jobs,
	})
}

func (co *CompanyResponse) GetCompanyJobsList(c *fiber.Ctx, db *sql.DB) error {
	var jobs []job.Job
	userID := c.Locals("userID")

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
	WHERE j.creator_id = $1 AND inactive = FALSE
	`)

	rows, err := db.Query(jobsQuery, userID)

	if err != nil {
		log.Printf("Помилка виконання запиту: %v\n", err)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": "Помилка запиту до бази даних",
		})
	}
	defer rows.Close()

	for rows.Next() {
		job := job.Job{}
		err := rows.Scan(&job.ID, &job.CreatorID, &job.Title, &job.Description,
			&job.CategoryName, &job.SubcategoryName, &job.CityName, &job.Experience,
			&job.EmploymentName, &job.SalaryFrom, &job.SalaryTo, &job.CreatedAt, &job.UpdatedAt,
			&job.CompanyID, &job.CompanyName, &job.ImageUrl)
		if err != nil {
			log.Printf("Error scanning row: %v, Data: %+v\n", err, job)
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"error": "Error scanning jobs",
			})
		}
		jobs = append(jobs, job)
	}

	return c.Status(fiber.StatusOK).JSON(jobs)
}

func (co *CompanyResponse) CreateCompany(c *fiber.Ctx, db *sql.DB) error {
	recruiterID := c.FormValue("recruiter_id", "")
	recruiterName := c.FormValue("recruiter_name", "")
	companyName := c.FormValue("company_name", "")
	aboutUs := c.FormValue("about_us", "")
	website := c.FormValue("web_site", "")
	linkedin := c.FormValue("linkedin", "")
	facebook := c.FormValue("facebook", "")
	phone := c.FormValue("phone", "")

	log.Printf("Received data: recruiterID=%s, recruiterName=%s, companyName=%s", recruiterID, recruiterName, companyName)

	avatarFile, err := c.FormFile("avatar")
	var avatarURL string
	if err != nil && err.Error() != "http: no such file" {
		log.Printf("Error processing avatar file: %v", err)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to process avatar file",
		})
	}

	if avatarFile != nil {
		log.Printf("Uploading avatar for company: %s", companyName)
		avatarURL, err = media.UploadPhoto(avatarFile, companyName)
		if err != nil {
			log.Printf("Failed to upload photo to S3: %v", err)
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"error": fmt.Sprintf("Failed to upload photo to S3: %v", err),
			})
		}
	}

	phoneNumber, err := strconv.Atoi(phone)
	if err != nil {
		log.Printf("Invalid phone number format: %v", err)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": "Invalid phone number format",
		})
	}

	query := `INSERT INTO "Company" ("recruiter_id", "company_name", "about_us", "image_url", 
        "web_site", "linkedin", "facebook", "phone_number", "recruiter_name", "created_at", "updated_at")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW()) RETURNING "id"`

	var companyID uint
	log.Printf("Executing query to insert company into database: %s", companyName)
	err = db.QueryRow(query, recruiterID, companyName, aboutUs, avatarURL, website, linkedin, facebook, phoneNumber, recruiterName).Scan(&companyID)
	if err != nil {
		log.Printf("Error inserting company into database: %v", err)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": fmt.Sprintf("Error inserting company into database: %v", err),
		})
	}

	log.Printf("Company created successfully with ID: %d", companyID)

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message":    "Company created successfully",
		"avatar_url": avatarURL,
	})
}
