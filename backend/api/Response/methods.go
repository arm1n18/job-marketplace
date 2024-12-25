package response

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type Body struct {
	ID                uint   `json:"id"`
	Title             string `json:"title"`
	CompanyName       string `json:"company_name"`
	ImageUrl          string `json:"image_url"`
	Salary            string `json:"salary"`
	Description       string `json:"description"`
	CityAndExperience string `json:"city_and_experience"`
}

type Email struct {
	To      string `json:"to"`
	Subject string `json:"subject"`
	Body    Body   `json:"body"`
}

var status = map[string]string{
	"applyForJob":    "APPLICATION_PENDING",
	"acceptJob":      "SUCCEEDED",
	"rejectJob":      "REJECTED",
	"applyForResume": "OFFER_PENDING",
	"acceptResume":   "SUCCEEDED",
	"rejectResume":   "REJECTED",
}

func ApplyForJob(c *fiber.Ctx, applyData *ApplyData, db *sql.DB, status string) error {
	userRole := c.Locals("userRole")

	if userRole != "CANDIDATE" {
		return c.Status(http.StatusForbidden).JSON(fiber.Map{"error": userRole})
	}

	query := `INSERT INTO "JobApplication" ("job_id", "recruiter_id", "candidate_id", "status", "created_at", "updated_at")
				VALUES ($1, $2, $3, $4, NOW(), NOW())`

	_, err := db.Exec(query, applyData.ApplyingForId, applyData.RecruiterID, applyData.CandidateID, status)
	if err != nil {
		log.Print(err)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Job applied successfully",
	})
}

func RespondJob(c *fiber.Ctx, applyData *ApplyData, db *sql.DB, status string) error {
	userRole := c.Locals("userRole")

	if userRole != "CANDIDATE" {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": userRole})
	}

	query := `UPDATE "ResumeApplication"
		SET "status" = $3
		WHERE "job_id" = $1 AND "candidate_id" = $2`

	_, err := db.Exec(query, applyData.ApplyingForId, applyData.CandidateID, status)
	if err != nil {
		log.Print(err)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Job responded successfully",
	})
}

func ApplyForResume(c *fiber.Ctx, applyData *ApplyData, db *sql.DB, status string) error {
	userRole := c.Locals("userRole")

	if userRole != "RECRUITER" {
		return c.Status(http.StatusForbidden).JSON(fiber.Map{"error": userRole})
	}

	queryCheck := `SELECT EXISTS (SELECT 1 FROM "ResumeApplication" WHERE "resume_id" = $1 AND "job_id" = $2)`
	var exists bool

	err := db.QueryRow(queryCheck, applyData.ApplyingForId, applyData.JobID).Scan(&exists)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	if exists {
		return c.Status(http.StatusConflict).JSON(fiber.Map{"error": "Така заявка вже існує"})
	}

	query := `INSERT INTO "ResumeApplication" ("resume_id", "job_id", "candidate_id", "recruiter_id", "status", "created_at", "updated_at")
              VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING id`

	stmt, err := db.Prepare(query)
	if err != nil {
		log.Println("Error preparing query:", err)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Error preparing query"})
	}
	defer stmt.Close()

	err = stmt.QueryRow(applyData.ApplyingForId, applyData.JobID, applyData.CandidateID, applyData.RecruiterID, status).Scan(&applyData.ResponseID)
	if err != nil {
		log.Println("Error executing query:", err)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Resume applied successfully",
	})

	// Send email

	emailDataQuery := `SELECT
		j.id, j.title, co.company_name AS CompanyName, co.image_url AS ImageUrl,
		j.salary_from, j.salary_to, j.experience, ci.name AS CityName, j.description,
		u.email
	FROM "Job" j
	LEFT JOIN "Company" co ON j.creator_id = co.recruiter_id
	LEFT JOIN "City" ci ON j.city_id = ci.id
	LEFT JOIN "User" u ON u.id = (SELECT candidate_id FROM "ResumeApplication" WHERE id = $1)
	WHERE j.id = (SELECT job_id FROM "ResumeApplication" WHERE id = $1)
	`

	var email Email
	var SalaryFrom, SalaryTo, Experience int
	var City string

	err = db.QueryRow(emailDataQuery, applyData.ResponseID).Scan(&email.Body.ID, &email.Body.Title, &email.Body.CompanyName,
		&email.Body.ImageUrl, &SalaryFrom, &SalaryTo, &Experience, &City, &email.Body.Description, &email.To)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	var salary string

	if SalaryFrom == 0 {
		salary = "до $" + strconv.Itoa(int(SalaryTo))
	} else if SalaryTo == 0 {
		salary = "від $" + strconv.Itoa(int(SalaryFrom))
	} else if SalaryFrom != 0 && SalaryTo != 0 {
		salary = "від $" + strconv.Itoa(int(SalaryFrom)) + " до $" + strconv.Itoa(int(SalaryTo))
	}

	var city string

	if city == "" {
		city = "Україна"
	} else {
		city = "Україна(" + city + ")"
	}

	emailData := Email{
		To:      "bachinskijdenis@gmail.com",
		Subject: "Вам запропонували вакансію",
		Body: Body{
			ID:                email.Body.ID,
			Title:             email.Body.Title,
			CompanyName:       email.Body.CompanyName,
			ImageUrl:          email.Body.ImageUrl,
			Salary:            salary,
			CityAndExperience: city + ", " + strconv.Itoa(Experience) + " р. досвіду",
			Description:       email.Body.Description,
		},
	}

	data, _ := json.Marshal(emailData)

	req, err := http.NewRequest("POST", "http://127.0.0.1:8081/send", bytes.NewBuffer(data))
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	defer resp.Body.Close()

	return nil
}

func RespondResume(c *fiber.Ctx, applyData *ApplyData, db *sql.DB, status string) error {
	userRole := c.Locals("userRole")

	if userRole != "RECRUITER" {
		return c.Status(http.StatusForbidden).JSON(fiber.Map{"error": userRole})
	}

	fmt.Print(applyData.JobID, applyData.CandidateID, status)

	query := `UPDATE "JobApplication"
		SET "status" = $3
		WHERE "id" = $1 AND "candidate_id" = $2`

	_, err := db.Exec(query, applyData.ResponseID, applyData.CandidateID, status)
	if err != nil {
		log.Print(err)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Resume responded successfully",
	})
}

func (r *Response) Response(c *fiber.Ctx, db *sql.DB) error {
	var applyData ApplyData

	if err := c.BodyParser(&applyData); err != nil {
		return c.Status(http.StatusForbidden).JSON(fiber.Map{"error": err.Error()})
	}

	methodsMap := map[string]func(*fiber.Ctx, *ApplyData, *sql.DB, string) error{
		"applyForJob":    ApplyForJob,
		"acceptJob":      RespondJob,
		"rejectJob":      RespondJob,
		"applyForResume": ApplyForResume,
		"acceptResume":   RespondResume,
		"rejectResume":   RespondResume,
	}

	if handler, ok := methodsMap[applyData.Method]; ok {
		handler(c, &applyData, db, status[applyData.Method])
	}

	return nil
}

func GetCandidateApplicationInfo(c *fiber.Ctx, db *sql.DB) error {
	var resp СandidateResumeRespond
	query := `
	SELECT
		u.email, j.Title, j.id,
		co.company_name AS CompanyName,
		co.image_url AS ImageUrl, co.phone_number AS PhoneNumber, co.recruiter_name AS RecruiterName
	FROM "Company" co
	LEFT JOIN "User" u ON co.recruiter_id = u.id
	LEFT JOIN "Job" j ON j.id = (SELECT job_id FROM "ResumeApplication" WHERE "id" = $1)
	WHERE co.recruiter_id = (SELECT recruiter_id FROM "ResumeApplication" WHERE "id" = $1)
	`

	rows := db.QueryRow(query, c.Params("id"))
	err := rows.Scan(&resp.Email, &resp.JobTitle, &resp.JobID, &resp.CompanyName, &resp.ImageUrl, &resp.Phone, &resp.RecruiterName)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(resp)
}

func GetRecruiterApplicationInfo(c *fiber.Ctx, db *sql.DB) error {
	var resp RecruiterResumeRespond
	query := `
			SELECT 
			u.email, 
			r.Title AS resume_title, 
			r.id AS resume_id, 
			j.Title AS job_title, 
			j.id AS job_id
		FROM "ResumeApplication" ra
		JOIN "Resume" r ON r.id = ra.resume_id
		JOIN "User" u ON u.id = r.creator_id
		JOIN "Job" j ON j.id = ra.job_id
		WHERE ra.id = $1
	`

	rows := db.QueryRow(query, c.Params("id"))
	err := rows.Scan(&resp.Email, &resp.ResumeTitle, &resp.ResumeID, &resp.JobTitle, &resp.JobID)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(resp)
}

func (r *Response) GetApplicationInfo(c *fiber.Ctx, db *sql.DB) error {
	userRole := c.Locals("userRole")

	if userRole == "CANDIDATE" {
		GetCandidateOfferInfo(c, db)
	} else if userRole == "RECRUITER" {
		GetRecruiterApplicationInfo(c, db)
	}

	return nil
}

func GetCandidateOfferInfo(c *fiber.Ctx, db *sql.DB) error {
	var resp СandidateResumeRespond
	query := `
	SELECT
		u.email, j.Title, j.id,
		co.company_name AS CompanyName,
		co.image_url AS ImageUrl, co.phone_number AS PhoneNumber, co.recruiter_name AS RecruiterName
	FROM "Company" co
	LEFT JOIN "User" u ON co.recruiter_id = u.id
	LEFT JOIN "Job" j ON j.id = (SELECT job_id FROM "JobApplication" WHERE "id" = $1)
	WHERE co.recruiter_id = (SELECT recruiter_id FROM "JobApplication" WHERE "id" = $1)
	`

	rows := db.QueryRow(query, c.Params("id"))
	err := rows.Scan(&resp.Email, &resp.JobTitle, &resp.JobID, &resp.CompanyName, &resp.ImageUrl, &resp.Phone, &resp.RecruiterName)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(resp)
}

func GetRecruiterOfferInfo(c *fiber.Ctx, db *sql.DB) error {
	var resp RecruiterResumeRespond
	query := `
			SELECT 
			u.email, 
			r.Title AS resume_title, 
			r.id AS resume_id, 
			j.Title AS job_title,
			j.id AS job_id
		FROM "JobApplication" ja
		JOIN "Resume" r ON r.creator_id = ja.candidate_id
		JOIN "User" u ON u.id = r.creator_id
		JOIN "Job" j ON j.id = ja.job_id
		WHERE ja.id = $1
	`

	rows := db.QueryRow(query, c.Params("id"))
	err := rows.Scan(&resp.Email, &resp.ResumeTitle, &resp.ResumeID, &resp.JobTitle, &resp.JobID)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(resp)
}

func (r *Response) GetOfferInfo(c *fiber.Ctx, db *sql.DB) error {
	userRole := c.Locals("userRole")

	if userRole == "CANDIDATE" {
		GetCandidateApplicationInfo(c, db)
	} else if userRole == "RECRUITER" {
		GetRecruiterOfferInfo(c, db)
	}

	return nil
}

func (r *Response) GetCandidateAllResponses(c *fiber.Ctx, db *sql.DB) error {
	var resume CandidateAllResponses
	userID := c.Locals("userID")
	idStr := c.Params("id")
	offerStr := c.Query("offer")
	applicationStr := c.Query("application")
	id, _ := strconv.ParseInt(idStr, 10, 64)
	offer, _ := strconv.ParseInt(offerStr, 10, 64)
	application, _ := strconv.ParseInt(applicationStr, 10, 64)

	var source string

	if offerStr == "" && applicationStr == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "offer or application required"})
	}

	if offerStr != "" {
		source = "offer"
	} else {
		source = "application"
	}

	query := `
	SELECT r.ID, r.creator_id, r.Title, r.work_experience AS WorkExperience, r.Achievements,
	       c.Name AS CategoryName,
	       s.Name AS SubcategoryName,
		   r.key_words,
	       ct.Name AS CityName,
	       r.Experience, e.Name AS EmploymentName,
	       r.salary, r.created_at, r.updated_at,
		   a.id AS offer_id, ra.id AS application_id,
		   CASE 
				WHEN $5 = 'offer' THEN ra.status 
				WHEN $5 = 'application' THEN a.status
				ELSE NULL
			END AS status
	FROM "Resume" r
	LEFT JOIN "Category" c ON r.category_id = c.ID
	LEFT JOIN "Subcategory" s ON r.subcategory_id = s.ID
	LEFT JOIN "City" ct ON r.city_id = ct.ID
	LEFT JOIN "Employment" e ON r.employment_id = e.ID
	LEFT JOIN "User" u ON r.creator_id = u.ID
	LEFT JOIN "ResumeApplication" ra 
		ON ra.resume_id = r.id 
		AND ra.recruiter_id = $1 
		AND ra.id = $3
	LEFT JOIN "JobApplication" a 
		ON a.candidate_id = r.creator_id 
		AND a.recruiter_id = $1 
		AND a.id = $4
	WHERE r.ID = $2
	`

	var queryParams []interface{}
	queryParams = append(queryParams, userID, id, offer, application, source)

	log.Print(queryParams)

	rows, err := db.Query(query, queryParams...)
	if err != nil {
		log.Printf("Помилка виконання запиту: %v\n", err)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": "Помилка запиту до бази даних",
		})
	}
	defer rows.Close()

	for rows.Next() {
		err := rows.Scan(&resume.ID, &resume.CreatorID, &resume.Title, &resume.WorkExperience, &resume.Achievements,
			&resume.CategoryName, &resume.SubcategoryName, &resume.Keywords, &resume.CityName, &resume.Experience,
			&resume.EmploymentName, &resume.Salary, &resume.CreatedAt, &resume.UpdatedAt, &resume.OfferID, &resume.ApplicationID,
			&resume.Status)

		if err != nil {
			if err == sql.ErrNoRows {
				return c.Status(http.StatusNotFound).JSON(fiber.Map{
					"error": "Resume not found",
				})
			}
			log.Printf("Помилка виконання запиту: %v\n", err)
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"error": "Помилка запиту до бази даних",
			})
		}
	}

	if (resume.Status == sql.NullString{}) {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{
			"error": "Resume not found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(resume)
}
