package resume

import (
	"database/sql"
	"log"
	"net/http"
	"strconv"

	"backend/handlers"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

func (r *ResumeStruct) GetResumes(c *gin.Context, db *sql.DB) {
	params := handlers.GetSearchParams(c)
	userID, _ := c.Get("userID")
	var resumes []Resume

	query := (`
	SELECT r.ID, r.creator_id, r.Title, r.work_experience AS WorkExperience, r.Achievements,
	c.Name AS CategoryName,
	s.Name AS SubcategoryName,
	ct.Name AS CityName,
	r.Experience, e.Name AS EmploymentName,
	r.salary, r.created_at, r.updated_at, ja.status
	FROM "Resume" r
	LEFT JOIN "Category" c ON r.category_id = c.ID
	LEFT JOIN "Subcategory" s ON r.subcategory_id = s.ID
	LEFT JOIN "City" ct ON r.city_id = ct.ID
	LEFT JOIN "Employment" e ON r.employment_id = e.ID
	LEFT JOIN "User" u ON r.creator_id = u.ID
	LEFT JOIN "JobApplication" ja ON ja.candidate_id = r.creator_id AND ja.recruiter_id = $1
	WHERE TRUE
	`)

	var queryParams []interface{}
	queryParams = append(queryParams, userID)

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
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Помилка запиту до бази даних"})
		return
	}
	defer rows.Close()

	for rows.Next() {
		resume := Resume{}
		err := rows.Scan(&resume.ID, &resume.CreatorID, &resume.Title, &resume.WorkExperience,
			&resume.Achievements, &resume.CategoryName, &resume.SubcategoryName, &resume.CityName,
			&resume.Experience, &resume.EmploymentName, &resume.Salary, &resume.CreatedAt, &resume.UpdatedAt, &resume.Status)
		if err != nil {
			log.Printf("Error scanning row: %v, Data: %+v\n", err, resume)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error scanning jobs"})
			return
		}
		resumes = append(resumes, resume)
	}

	c.JSON(http.StatusOK, resumes)
}

func (r *ResumeStruct) GetResumeByID(c *gin.Context, db *sql.DB) {
	var resume Resume
	idStr := c.Param("id")
	id, _ := strconv.ParseInt(idStr, 10, 64)

	query := `
	SELECT r.ID, r.creator_id, r.Title, r.work_experience AS WorkExperience, r.Achievements,
	       c.Name AS CategoryName,
	       s.Name AS SubcategoryName,
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
		&resume.CategoryName, &resume.SubcategoryName, &resume.CityName, &resume.Experience,
		&resume.EmploymentName, &resume.Salary, &resume.CreatedAt, &resume.UpdatedAt)

	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Job not found"})
			return
		}
		log.Printf("Помилка виконання запиту: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Помилка запиту до бази даних"})
		return
	}

	c.JSON(http.StatusOK, resume)
}

func (r *ResumeStruct) CreateResume(c *gin.Context, db *sql.DB) {
	var resume ResumeCreate
	var categoryID, subcategoryID, employmentID, cityID, userID *int

	if err := c.ShouldBindJSON(&resume); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
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
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	defer rows.Close()

	if rows.Next() {
		err = rows.Scan(&categoryID, &subcategoryID, &employmentID, &cityID, &userID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
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
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"id": resumeID})
}

func (r *ResumeStruct) UpdateResume(c *gin.Context, db *sql.DB) {
	var resume ResumeCreate
	userID, _ := c.Get("userID")

	if err := c.ShouldBindJSON(&resume); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
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
			"experience" = $7, 
			"employment_id" = (SELECT id FROM "Employment" WHERE "name" = $8), 
			"salary" = $9, "updated_at" = NOW()
		WHERE "creator_id" = $10 AND "id" = $11`

	_, err := db.Exec(query, resume.Title, resume.WorkExperience, resume.Achievements,
		resume.CategoryName, nullableSubcategoryName, nullableCityName, resume.Experience,
		resume.EmploymentName, resume.Salary, userID, resume.ID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		log.Print(err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Resume updated successfully"})
}
