package resume

import (
	"database/sql"
	"log"
	"net/http"
	"strconv"

	"backend/handlers"

	"github.com/gofiber/fiber/v2"
	_ "github.com/lib/pq"
)

func (r *ResumeStruct) GetResumes(c *fiber.Ctx, db *sql.DB) error {
	params := handlers.GetSearchParams(c)
	var resumes []Resume

	query := (`SELECT DISTINCT
	r.ID, r.creator_id, r.Title, r.work_experience AS WorkExperience, r.Achievements,
	c.Name AS CategoryName,
	s.Name AS SubcategoryName,
	r.key_words,
	ct.Name AS CityName,
	r.Experience, e.Name AS EmploymentName,
	r.salary, r.created_at, r.updated_at
	FROM "Resume" r
	LEFT JOIN "Category" c ON r.category_id = c.ID
	LEFT JOIN "Subcategory" s ON r.subcategory_id = s.ID
	LEFT JOIN "City" ct ON r.city_id = ct.ID
	LEFT JOIN "Employment" e ON r.employment_id = e.ID
	LEFT JOIN "User" u ON r.creator_id = u.ID
	WHERE TRUE
	`)

	var queryParams []interface{}

	argID := 2

	if params.Search != "" {
		query += `AND (r.title ILIKE '%' || $` + strconv.Itoa(argID) + ` || '%'
		OR c.Name ILIKE '%' || $` + strconv.Itoa(argID) + ` || '%'
		OR s.Name ILIKE '%' || $` + strconv.Itoa(argID) + ` || '%')`
		queryParams = append(queryParams, params.Search)
		argID++
	}

	if params.Category != "" {
		query += ` AND c.Name = $` + strconv.Itoa(argID)
		queryParams = append(queryParams, params.Category)
		argID++
	}

	if params.Subcategory != "" {
		query += ` AND s.Name = $` + strconv.Itoa(argID)
		queryParams = append(queryParams, params.Subcategory)
		argID++
	}

	if params.Experience != "" {
		query += ` AND r.Experience = $` + strconv.Itoa(argID)
		queryParams = append(queryParams, params.Experience)
		argID++
	}

	if params.Employment != "" {
		query += ` AND e.Name = $` + strconv.Itoa(argID)
		queryParams = append(queryParams, params.Employment)
		argID++
	}

	if params.City != "" {
		query += ` AND ct.Name = $` + strconv.Itoa(argID)
		queryParams = append(queryParams, params.City)
		argID++
	}

	if params.Salary != "" {
		query += ` AND r.salary = $` + strconv.Itoa(argID)
		queryParams = append(queryParams, params.Salary)
		argID++
	}

	query += ` ORDER BY r.updated_at DESC
	LIMIT 15`

	rows, err := db.Query(query, queryParams...)
	if err != nil {
		log.Printf("Помилка виконання запиту: %v\n", err)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": "Помилка запиту до бази даних",
		})
	}
	defer rows.Close()

	for rows.Next() {
		resume := Resume{}
		err := rows.Scan(&resume.ID, &resume.CreatorID, &resume.Title, &resume.WorkExperience,
			&resume.Achievements, &resume.CategoryName, &resume.SubcategoryName, &resume.Keywords, &resume.CityName,
			&resume.Experience, &resume.EmploymentName, &resume.Salary, &resume.CreatedAt, &resume.UpdatedAt)
		if err != nil {
			log.Printf("Error scanning row: %v, Data: %+v\n", err, resume)
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"error": "Error scanning resumes",
			})
		}
		resumes = append(resumes, resume)
	}

	return c.Status(fiber.StatusOK).JSON(resumes)
}

func (r *ResumeStruct) GetResumeByID(c *fiber.Ctx, db *sql.DB) error {
	var resume Resume
	idStr := c.Params("id")
	id, _ := strconv.ParseInt(idStr, 10, 64)

	query := `
	SELECT r.ID, r.creator_id, r.Title, r.work_experience AS WorkExperience, r.Achievements,
	       c.Name AS CategoryName,
	       s.Name AS SubcategoryName,
		   r.key_words,
	       ct.Name AS CityName,
	       r.Experience, e.Name AS EmploymentName,
	       r.salary, r.created_at, r.updated_at
	FROM "Resume" r
	LEFT JOIN "Category" c ON r.category_id = c.ID
	LEFT JOIN "Subcategory" s ON r.subcategory_id = s.ID
	LEFT JOIN "City" ct ON r.city_id = ct.ID
	LEFT JOIN "Employment" e ON r.employment_id = e.ID
	LEFT JOIN "User" u ON r.creator_id = u.ID
	WHERE r.ID = $1
	`

	row := db.QueryRow(query, id)
	err := row.Scan(&resume.ID, &resume.CreatorID, &resume.Title, &resume.WorkExperience, &resume.Achievements,
		&resume.CategoryName, &resume.SubcategoryName, &resume.Keywords, &resume.CityName, &resume.Experience,
		&resume.EmploymentName, &resume.Salary, &resume.CreatedAt, &resume.UpdatedAt)

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

	return c.Status(fiber.StatusOK).JSON(resume)
}

func (r *ResumeStruct) CreateResume(c *fiber.Ctx, db *sql.DB) error {
	var resume ResumeCreate
	var categoryID, subcategoryID, employmentID, cityID, userID *int

	if err := c.BodyParser(&resume); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	var nullableSubcategoryName, nullableCityName *string
	if resume.SubcategoryName == nil || *resume.SubcategoryName == "" {
		nullableSubcategoryName = nil
	} else {
		nullableSubcategoryName = resume.SubcategoryName
	}

	if resume.CityName == nil || *resume.CityName == "" {
		nullableCityName = nil
	} else {
		nullableCityName = resume.CityName
	}

	query := `
    SELECT c.ID, s.ID, e.ID, ci.ID, u.ID
    FROM "Category" c
    LEFT JOIN "Subcategory" s ON s.category_id = c.ID AND s.Name = $1
    LEFT JOIN "Employment" e ON e.Name = $2
    LEFT JOIN "City" ci ON ci.Name = $3
    LEFT JOIN "User" u ON u.Email = $4
    WHERE c.Name = $5`

	rows, err := db.Query(query, nullableSubcategoryName, resume.EmploymentName, nullableCityName, resume.Email, resume.CategoryName)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	defer rows.Close()

	if rows.Next() {
		err = rows.Scan(&categoryID, &subcategoryID, &employmentID, &cityID, &userID)
		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}
	}

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	query = `INSERT INTO "Resume" ("creator_id", "title", "work_experience", "achievements",
			"category_id", "subcategory_id", "city_id", "experience", "employment_id", "salary", "created_at", "updated_at")
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW()) RETURNING id`

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

	var resumeID int
	err = db.QueryRow(query, userID, resume.Title, resume.WorkExperience, resume.Achievements,
		categoryID, nullableSubcategoryID, nullableCityID, resume.Experience, employmentID, resume.Salary).Scan(&resumeID)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"id": resumeID,
	})
}

func (r *ResumeStruct) UpdateResume(c *fiber.Ctx, db *sql.DB) error {
	var resume ResumeCreate
	userID := c.Locals("userID")

	if err := c.BodyParser(&resume); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	var nullableSubcategoryName, nullableCityName *string
	if resume.SubcategoryName == nil || *resume.SubcategoryName == "" {
		nullableSubcategoryName = nil
	} else {
		nullableSubcategoryName = resume.SubcategoryName
	}

	if resume.CityName == nil || *resume.CityName == "" {
		nullableCityName = nil
	} else {
		nullableCityName = resume.CityName
	}

	query := `UPDATE "Resume"
		SET 
			"title" = $1, "work_experience" = $2, "achievements" = $3, 
			"category_id" = (SELECT id FROM "Category" WHERE "name" = $4), 
			"subcategory_id" = (SELECT id FROM "Subcategory" WHERE "name" = $5),
			"city_id" = (SELECT id FROM "City" WHERE "name" = $6), 
			"key_words" = $12,
			"experience" = $7, 
			"employment_id" = (SELECT id FROM "Employment" WHERE "name" = $8), 
			"salary" = $9, "updated_at" = NOW()
		WHERE "creator_id" = $10 AND "id" = $11`

	_, err := db.Exec(query, resume.Title, resume.WorkExperience, resume.Achievements,
		resume.CategoryName, nullableSubcategoryName, nullableCityName, resume.Experience,
		resume.EmploymentName, resume.Salary, userID, resume.ID, resume.Keywords)

	if err != nil {
		log.Print(err)
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Resume updated successfully",
	})
}
