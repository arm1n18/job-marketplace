package inbox

import (
	job "backend/api/Job"
	"database/sql"
	"log"
	"net/http"

	"github.com/gofiber/fiber/v2"
)

func GetInboxCandidateApplications(c *fiber.Ctx, db *sql.DB) ([]job.Job, error) {
	userID := c.Locals("userID")

	var applications []job.Job

	query := (`
	SELECT j.ID, j.creator_id, j.Title, j.Description, j.Requirements, j.Offer,
		c.Name AS CategoryName,
		s.Name AS SubcategoryName,
		j.key_words,
		ct.Name AS CityName,
		j.Experience, e.Name AS EmploymentName,
		j.salary_from, j.salary_to, j.created_at, j.updated_at,
		co.ID AS CompanyID, co.company_name AS CompanyName,
		co.about_us AS AboutUs, co.image_url AS ImageUrl, co.web_site AS WebSite,
		a.status AS status, a.id AS offer_id
	FROM "Job" j
	LEFT JOIN "Category" c ON j.category_id = c.ID
	LEFT JOIN "Subcategory" s ON j.subcategory_id = s.ID
	LEFT JOIN "City" ct ON j.city_id = ct.ID
	LEFT JOIN "Employment" e ON j.employment_id = e.ID
	LEFT JOIN "User" u ON j.creator_id = u.ID
	LEFT JOIN "Company" co ON u.ID = co.recruiter_id
	JOIN "JobApplication" a ON a.job_id = j.ID
	WHERE a.candidate_id = $1 AND j.inactive = FALSE
	ORDER BY j.updated_at DESC
	`)

	rows, err := db.Query(query, userID)
	if err != nil {
		log.Printf("Помилка виконання запиту: %v\n", err)
		c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Помилка запиту до бази даних"})
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		job := job.Job{}
		err := rows.Scan(&job.ID, &job.CreatorID, &job.Title, &job.Description, &job.Requirements, &job.Offer,
			&job.CategoryName, &job.SubcategoryName, &job.Keywords, &job.CityName, &job.Experience, &job.EmploymentName,
			&job.SalaryFrom, &job.SalaryTo, &job.CreatedAt, &job.UpdatedAt, &job.CompanyID, &job.CompanyName, &job.AboutUs, &job.ImageUrl, &job.WebSite, &job.Status, &job.ApplicationID)
		if err != nil {
			log.Printf("Error scanning row: %v, Data: %+v\n", err, job)
			c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Error scanning"})
			return nil, err
		}
		applications = append(applications, job)
	}

	return applications, nil
}

func GetInboxCandidateOffers(c *fiber.Ctx, db *sql.DB) ([]job.Job, error) {
	userID := c.Locals("userID")

	var offers []job.Job

	query := (`
	SELECT j.ID, j.creator_id, j.Title, j.Description, j.Requirements, j.Offer,
		c.Name AS CategoryName,
		s.Name AS SubcategoryName,
		j.key_words,
		ct.Name AS CityName,
		j.Experience, e.Name AS EmploymentName,
		j.salary_from, j.salary_to, j.created_at, j.updated_at,
		co.ID AS CompanyID, co.company_name AS CompanyName,
		co.about_us AS AboutUs, co.image_url AS ImageUrl, co.web_site AS WebSite,
		a.status AS status, a.id AS application_id
	FROM "Job" j
	LEFT JOIN "Category" c ON j.category_id = c.ID
	LEFT JOIN "Subcategory" s ON j.subcategory_id = s.ID
	LEFT JOIN "City" ct ON j.city_id = ct.ID
	LEFT JOIN "Employment" e ON j.employment_id = e.ID
	LEFT JOIN "User" u ON j.creator_id = u.ID
	LEFT JOIN "Company" co ON u.ID = co.recruiter_id
	JOIN "ResumeApplication" a ON a.job_id = j.ID
	WHERE a.candidate_id = $1
	ORDER BY j.updated_at DESC
	`)

	rows, err := db.Query(query, userID)
	if err != nil {
		log.Printf("Помилка виконання запиту: %v\n", err)
		c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Помилка запиту до бази даних"})
		return nil, err

	}
	defer rows.Close()

	for rows.Next() {
		job := job.Job{}
		err := rows.Scan(&job.ID, &job.CreatorID, &job.Title, &job.Description, &job.Requirements, &job.Offer,
			&job.CategoryName, &job.SubcategoryName, &job.Keywords, &job.CityName, &job.Experience, &job.EmploymentName,
			&job.SalaryFrom, &job.SalaryTo, &job.CreatedAt, &job.UpdatedAt, &job.CompanyID, &job.CompanyName,
			&job.AboutUs, &job.ImageUrl, &job.WebSite, &job.Status, &job.OfferID)
		if err != nil {
			log.Printf("Error scanning row: %v, Data: %+v\n", err, job)
			c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Error scanning"})
			return nil, err
		}
		offers = append(offers, job)
	}

	return offers, nil
}

func GetInboxRecruiterApplications(c *fiber.Ctx, db *sql.DB) ([]ResumeRespond, error) {
	userID := c.Locals("userID")

	var offers []ResumeRespond

	query := (`
	SELECT r.ID, r.creator_id, r.Title, r.work_experience AS WorkExperience, r.Achievements,
	       c.Name AS CategoryName,
	       s.Name AS SubcategoryName,
		   r.key_words,
	       ct.Name AS CityName,
	       r.Experience, e.Name AS EmploymentName,
	       r.salary, r.created_at, r.updated_at,
		   a.status AS status, j.Title, j.ID, a.id AS application_id
	FROM "Resume" r
	LEFT JOIN "Category" c ON r.category_id = c.ID
	LEFT JOIN "Subcategory" s ON r.subcategory_id = s.ID
	LEFT JOIN "City" ct ON r.city_id = ct.ID
	LEFT JOIN "Employment" e ON r.employment_id = e.ID
	LEFT JOIN "User" u ON r.creator_id = u.ID
	LEFT JOIN "ResumeApplication" a ON a.resume_id = r.ID
	LEFT JOIN "Job" j ON j.ID = a.job_id
	WHERE a.recruiter_id = $1
	AND j.ID = a.job_id AND j.inactive = FALSE
	ORDER BY r.updated_at DESC
	`)

	rows, err := db.Query(query, userID)
	if err != nil {
		log.Printf("Помилка виконання запиту: %v\n", err)
		c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Помилка запиту до бази даних"})
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		resume := ResumeRespond{}
		err := rows.Scan(&resume.ID, &resume.CreatorID, &resume.Title, &resume.WorkExperience,
			&resume.Achievements, &resume.CategoryName, &resume.SubcategoryName, &resume.Keywords, &resume.CityName,
			&resume.Experience, &resume.EmploymentName, &resume.Salary, &resume.CreatedAt,
			&resume.UpdatedAt, &resume.Status, &resume.JobTitle, &resume.JobID, &resume.ApplicationID)
		if err != nil {
			log.Printf("Error scanning row: %v, Data: %+v\n", err, resume)
			c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Error scanning"})
			return nil, err
		}
		offers = append(offers, resume)
	}

	return offers, nil
}

func GetInboxRecruiterOffers(c *fiber.Ctx, db *sql.DB) ([]ResumeRespond, error) {
	userID := c.Locals("userID")

	var offers []ResumeRespond

	query := (`
	SELECT 
		r.ID, r.creator_id, r.Title, r.work_experience AS WorkExperience, 
		r.Achievements, c.Name AS CategoryName, s.Name AS SubcategoryName,
		r.key_words, ct.Name AS CityName, r.Experience, e.Name AS EmploymentName,
		r.salary, r.created_at, r.updated_at, ja.status AS status, 
    	j.Title AS JobTitle,  j.ID AS JobID, ja.id AS offer_id
	FROM "Resume" r
	LEFT JOIN "Category" c ON r.category_id = c.ID
	LEFT JOIN "Subcategory" s ON r.subcategory_id = s.ID
	LEFT JOIN "City" ct ON r.city_id = ct.ID
	LEFT JOIN "Employment" e ON r.employment_id = e.ID
	LEFT JOIN "User" u ON r.creator_id = u.ID
	LEFT JOIN "JobApplication" ja ON ja.candidate_id = r.creator_id
	LEFT JOIN "Job" j ON ja.job_id = j.ID
	WHERE ja.recruiter_id = $1 AND j.inactive = FALSE
	ORDER BY r.updated_at DESC
	`)

	rows, err := db.Query(query, userID)
	if err != nil {
		log.Printf("Помилка виконання запиту: %v\n", err)
		c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Помилка запиту до бази даних"})
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		resume := ResumeRespond{}
		err := rows.Scan(&resume.ID, &resume.CreatorID, &resume.Title, &resume.WorkExperience,
			&resume.Achievements, &resume.CategoryName, &resume.SubcategoryName, &resume.Keywords, &resume.CityName,
			&resume.Experience, &resume.EmploymentName, &resume.Salary, &resume.CreatedAt,
			&resume.UpdatedAt, &resume.Status, &resume.JobTitle, &resume.JobID, &resume.OfferID)
		if err != nil {
			log.Printf("Error scanning row: %v, Data: %+v\n", err, resume)
			c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Error scanning"})
			return nil, err
		}
		offers = append(offers, resume)
	}

	return offers, nil
}

func (in *Inbox) GetInbox(c *fiber.Ctx, db *sql.DB) error {
	userRole := c.Locals("userRole")
	userID := c.Locals("userID")

	log.Print(userID)

	if userRole == "CANDIDATE" {
		applications, _ := GetInboxCandidateApplications(c, db)
		offers, _ := GetInboxCandidateOffers(c, db)
		return c.Status(fiber.StatusOK).JSON(fiber.Map{"applications": applications, "offers": offers})
	} else if userRole == "RECRUITER" {
		applications, _ := GetInboxRecruiterApplications(c, db)
		offers, _ := GetInboxRecruiterOffers(c, db)
		return c.Status(fiber.StatusOK).JSON(fiber.Map{"applications": applications, "offers": offers})
	}

	return nil
}
