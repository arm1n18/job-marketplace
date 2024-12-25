package job

import (
	"backend/handlers"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func (j *Job) GetJobs(c *fiber.Ctx, db *sql.DB) error {
	params := handlers.GetSearchParams(c)
	userID := c.Locals("userID")
	var jobs []Job
	query := (`
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
			ja.status
		) AS status, ja.id AS offer_id, ra.id AS application_id
	FROM "Job" j
	INNER JOIN "Category" c ON j.category_id = c.ID
	LEFT JOIN "Subcategory" s ON j.subcategory_id = s.ID
	LEFT JOIN "City" ct ON j.city_id = ct.ID
	INNER JOIN "Employment" e ON j.employment_id = e.ID
	INNER JOIN "User" u ON j.creator_id = u.ID
	INNER JOIN "Company" co ON u.ID = co.recruiter_id
	LEFT JOIN "ResumeApplication" ra ON ra.job_id = j.ID AND ra.candidate_id = $1
	LEFT JOIN "JobApplication" ja ON ja.job_id = j.ID AND ja.candidate_id = $1
	WHERE j.inactive = FALSE
	`)

	var queryParams []interface{}
	queryParams = append(queryParams, userID)

	// if userRole == "CANDIDATE" {
	// 	query += ` AND (a.candidate_id = $2 OR a.candidate_id IS NULL)`
	// } else {
	// 	query += ` AND a.candidate_id IS NULL`
	// }

	argID := 2

	if params.Search != "" {
		query += ` AND (
			j.title ILIKE '%' || $` + strconv.Itoa(argID) + ` || '%' 
			OR c.Name ILIKE '%' || $` + strconv.Itoa(argID) + ` || '%'
			OR s.Name ILIKE '%' || $` + strconv.Itoa(argID) + ` || '%'
			OR co.company_name ILIKE '%' || $` + strconv.Itoa(argID) + ` || '%'
		)`
		queryParams = append(queryParams, params.Search)
		argID++
	}

	if params.Category != "" {
		query += ` AND c.Name ILIKE $` + strconv.Itoa(argID)
		queryParams = append(queryParams, params.Category)
		argID++
	}

	if params.Subcategory != "" {
		query += ` AND s.Name ILIKE $` + strconv.Itoa(argID)
		queryParams = append(queryParams, params.Subcategory)
		argID++
	}

	if params.Experience != "" {
		query += ` AND j.Experience = $` + strconv.Itoa(argID)
		queryParams = append(queryParams, params.Experience)
		argID++
	}

	if params.Employment != "" {
		query += ` AND e.Name = $` + strconv.Itoa(argID)
		queryParams = append(queryParams, params.Employment)
		argID++
	}

	if params.City != "" {
		if params.City == "Вся Україна" {
			return nil
		} else {
			query += ` AND ct.Name = $` + strconv.Itoa(argID)
			queryParams = append(queryParams, params.City)
			argID++
		}
	}

	if params.Salary != "" {
		if params.Salary == "0" {
			return nil
		}
		query += ` AND (j.salary_from >= $` + strconv.Itoa(argID) + ` OR j.salary_to >= $` + strconv.Itoa(argID) + `)`
		queryParams = append(queryParams, params.Salary)
		argID++
	}

	offset := (params.Page - 1) * 15

	query += ` ORDER BY j.updated_at DESC
	LIMIT 15 OFFSET $` + strconv.Itoa(argID)
	queryParams = append(queryParams, offset)

	rows, err := db.Query(query, queryParams...)
	if err != nil {
		log.Printf("Помилка виконання запиту: %v\n", err)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": "Помилка запиту до бази даних",
		})
	}
	defer rows.Close()

	for rows.Next() {
		job := Job{}
		err := rows.Scan(&job.ID, &job.CreatorID, &job.Title, &job.Description, &job.Requirements, &job.Offer,
			&job.CategoryName, &job.SubcategoryName, &job.Keywords, &job.CityName, &job.Experience, &job.EmploymentName,
			&job.SalaryFrom, &job.SalaryTo, &job.CreatedAt, &job.UpdatedAt, &job.CompanyID, &job.CompanyName,
			&job.AboutUs, &job.ImageUrl, &job.WebSite, &job.Status, &job.OfferID, &job.ApplicationID)
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

func (job *Job) GetJobByID(c *fiber.Ctx, db *sql.DB) error {
	userID := c.Locals("userID")
	idStr := c.Params("id")
	id, _ := strconv.ParseInt(idStr, 10, 64)

	query := `
	SELECT j.ID, j.creator_id, j.Title, j.Description, j.Requirements, j.Offer,
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
			) AS status, a.id AS offer_id, ra.id AS application_id
	FROM "Job" j
	INNER JOIN "Category" c ON j.category_id = c.ID
	LEFT JOIN "Subcategory" s ON j.subcategory_id = s.ID
	LEFT JOIN "City" ct ON j.city_id = ct.ID
	INNER JOIN "Employment" e ON j.employment_id = e.ID
	INNER JOIN "User" u ON j.creator_id = u.ID
	INNER JOIN "Company" co ON u.ID = co.recruiter_id
	LEFT JOIN "ResumeApplication" ra ON ra.job_id = j.ID AND ra.candidate_id = $1
	LEFT JOIN "JobApplication" a ON a.job_id = j.ID AND a.candidate_id = $1
	WHERE j.ID = $2 AND j.inactive = FALSE
	`

	row := db.QueryRow(query, userID, id)
	err := row.Scan(&job.ID, &job.CreatorID, &job.Title, &job.Description, &job.Requirements, &job.Offer,
		&job.CategoryName, &job.SubcategoryName, &job.Keywords, &job.CityName, &job.Experience, &job.EmploymentName,
		&job.SalaryFrom, &job.SalaryTo, &job.CreatedAt, &job.UpdatedAt,
		&job.CompanyID, &job.CompanyName, &job.AboutUs, &job.ImageUrl, &job.WebSite, &job.Status, &job.OfferID, &job.ApplicationID)

	if err != nil {
		if err == sql.ErrNoRows {
			return c.Status(http.StatusNotFound).JSON(fiber.Map{
				"error": "Job not found",
			})
		}
		log.Printf("Помилка виконання запиту: %v\n", err)

		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": "Помилка запиту до бази даних",
		})
	}

	return c.Status(fiber.StatusOK).JSON(job)
}

func (j *Job) CreateJob(c *fiber.Ctx, db *sql.DB) error {
	var job JobCreate
	var categoryID, subcategoryID, employmentID, cityID, userID, companyID *int

	if err := c.BodyParser(&job); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	var nullableSubcategoryName, nullableCityName *string
	if job.SubcategoryName == nil || *job.SubcategoryName == "" {
		nullableSubcategoryName = nil
	} else {
		nullableSubcategoryName = job.SubcategoryName
	}

	if job.CityName == nil || *job.CityName == "" {
		nullableCityName = nil
	} else {
		nullableCityName = job.CityName
	}

	query := `
    SELECT c.ID, s.ID, e.ID, ci.ID, u.ID, co.ID
    FROM "Category" c
    LEFT JOIN "Subcategory" s ON s.category_id = c.ID AND s.Name = $1
    LEFT JOIN "Employment" e ON e.Name = $2
    LEFT JOIN "City" ci ON ci.Name = $3
    LEFT JOIN "User" u ON u.Email = $4
    LEFT JOIN "Company" co ON co.recruiter_id = $5
    WHERE c.Name = $6`

	rows, err := db.Query(query, nullableSubcategoryName, job.EmploymentName, nullableCityName, job.Email, job.ID, job.CategoryName)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	defer rows.Close()

	if rows.Next() {
		err = rows.Scan(&categoryID, &subcategoryID, &employmentID, &cityID, &userID, &companyID)
		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}
	} else {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": "Data not found",
		})
	}

	if employmentID == nil || *employmentID == 0 {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "Employment not found",
		})
	}

	insertQuery := `
    INSERT INTO "Job" ("creator_id", "title", "description", "requirements", "offer", 
    "category_id", "subcategory_id", "city_id", "experience", "employment_id", 
    "salary_from", "salary_to", "company_id", "inactive", "key_words", "created_at", "updated_at") 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, FALSE, $14 ,NOW(), NOW()) 
    RETURNING id`

	var nullableSubcategoryID, nullableCityID *int
	if subcategoryID == nil || *subcategoryID == 0 {
		nullableSubcategoryID = nil
	} else {
		nullableSubcategoryID = subcategoryID
	}

	if cityID == nil || *cityID == 0 {
		nullableCityID = nil
	} else {
		nullableCityID = cityID
	}

	var jobID int
	err = db.QueryRow(insertQuery, userID, job.Title, job.Description, job.Requirements, job.Offer,
		categoryID, nullableSubcategoryID, nullableCityID, job.Experience, employmentID,
		job.SalaryFrom, job.SalaryTo, companyID, job.Keywords).Scan(&jobID)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})

	}

	fmt.Print("Created job ID:", jobID)
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"id": jobID,
	})
}

// func (j *Job) DeleteJob(c *gin.Context, db *sql.DB) { // REMOVED, NOW USE DeactivateJob FOR ARCHIVATION
// 	userID, _ := c.Get("userID")
// 	idStr := c.Param("id")
// 	id, _ := strconv.ParseInt(idStr, 10, 64)

// 	tx, err := db.Begin()
// 	if err != nil {
// 		log.Printf("Помилка створення транзакції: %v\n", err)
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Помилка створення транзакції"})
// 		return
// 	}

// 	defer tx.Rollback()

// 	_, err = tx.Exec(`DELETE FROM "JobApplication" WHERE job_id = $1`, id)
// 	if err != nil {
// 		log.Printf("Помилка виконання запиту: %v\n", err)
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Помилка запиту до бази даних"})
// 		return
// 	}

// 	_, err = tx.Exec(`DELETE FROM "ResumeApplication" WHERE job_id = $1`, id)
// 	if err != nil {
// 		log.Printf("Помилка виконання запиту: %v\n", err)
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Помилка запиту до бази даних"})
// 		return
// 	}

// 	_, err = tx.Exec(`DELETE FROM "Job" WHERE id = $1 AND creator_id = $2`, id, userID)
// 	if err != nil {
// 		log.Printf("Помилка виконання запиту: %v\n", err)
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Помилка запиту до бази даних"})
// 		return
// 	}

// 	err = tx.Commit()
// 	if err != nil {
// 		log.Printf("Помилка завершення транзакції: %v\n", err)
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Помилка завершення транзакції"})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"message": "Вакансія успішно видалена"})
// }

func (j *Job) DeactivateJob(c *fiber.Ctx, db *sql.DB) error {
	userID := c.Locals("userID")
	idStr := c.Params("id")
	id, _ := strconv.ParseInt(idStr, 10, 64)

	_, err := db.Exec(`UPDATE "Job" SET inactive = TRUE WHERE id = $1 AND creator_id = $2`, id, userID)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Вакансія успішно видалена",
	})
}

func (j *Job) UpdateJob(c *fiber.Ctx, db *sql.DB) error {
	var job JobCreate
	userID := c.Locals("userID")

	if err := c.BodyParser(&job); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	var nullableSubcategoryName, nullableCityName *string
	if job.SubcategoryName == nil || *job.SubcategoryName == "" {
		nullableSubcategoryName = nil
	} else {
		nullableSubcategoryName = job.SubcategoryName
	}

	if job.CityName == nil || *job.CityName == "" {
		nullableCityName = nil
	} else {
		nullableCityName = job.CityName
	}

	query := `UPDATE "Job"
		SET 
			"title" = $1, "description" = $2, "requirements" = $3, "offer" = $4, 
			"category_id" = (SELECT id FROM "Category" WHERE "name" = $5), 
			"subcategory_id" = (SELECT id FROM "Subcategory" WHERE "name" = $6),
			"city_id" = (SELECT id FROM "City" WHERE "name" = $7), 
			"key_words" = $14,
			"experience" = $8, 
			"employment_id" = (SELECT id FROM "Employment" WHERE "name" = $9), 
			"salary_from" = $10, "salary_to" = $11, "updated_at" = NOW()
		WHERE "id" = $12 AND "creator_id" = $13
	`

	_, err := db.Exec(query, job.Title, job.Description, job.Requirements,
		job.Offer, job.CategoryName, nullableSubcategoryName, nullableCityName,
		job.Experience, job.EmploymentName, job.SalaryFrom, job.SalaryTo, job.ID, userID, job.Keywords)
	if err != nil {
		log.Print(err)
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Job updated successfully",
	})
}
