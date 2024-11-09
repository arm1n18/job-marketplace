package api

import (
	"backend/config"
	"database/sql"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type JobCreate struct {
	ID              uint    `json:"id"`
	Email           string  `json:"email"`
	Title           string  `json:"title"`
	CategoryName    string  `json:"category_name"`
	SubcategoryName *string `json:"subcategory_name"`
	CityName        *string `json:"city"`
	Experience      float64 `json:"experience"`
	EmploymentName  string  `json:"employment_name"`
	SalaryFrom      uint    `json:"salary_from"`
	SalaryTo        uint    `json:"salary_to"`
	Description     string  `json:"description"`
	Requirements    string  `json:"requirements"`
	Offer           string  `json:"offer"`
}

func CreateJob(c *gin.Context) {
	var job JobCreate
	var categoryID, subcategoryID, employmentID, cityID, userID, companyID *int

	cfg := config.LoadDataBaseConfig()

	dsn := "host=" + cfg.Host + " user=" + cfg.User + " password=" + cfg.Password + " dbname=" + cfg.DBName + " sslmode=require"

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Println("Помилка підключення до бази даних:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Помилка запиту до бази даних"})
		return
	}
	defer db.Close()

	if err := c.ShouldBindJSON(&job); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
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
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	defer rows.Close()

	if rows.Next() {
		err = rows.Scan(&categoryID, &subcategoryID, &employmentID, &cityID, &userID, &companyID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	} else {
		c.JSON(http.StatusNotFound, gin.H{"error": "Data not found"})
		return
	}

	if employmentID == nil || *employmentID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Employment not found"})
		return
	}

	insertQuery := `
    INSERT INTO "Job" ("creator_id", "title", "description", "requirements", "offer", 
    "category_id", "subcategory_id", "city_id", "experience", "employment_id", 
    "salary_from", "salary_to", "company_id", "created_at", "updated_at") 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW()) 
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
		job.SalaryFrom, job.SalaryTo, companyID).Scan(&jobID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"id": jobID})
}
