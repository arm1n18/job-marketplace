package api

import (
	"backend/config"
	"database/sql"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type ResumeCreate struct {
	ID             uint   `json:"id"`
	Email          string `json:"email"`
	Title          string `json:"title"`
	WorkExperience string `json:"work_experience"`
	Achievements   string `json:"achievements"`

	CategoryName    string  `json:"category_name"`
	SubcategoryName *string `json:"subcategory_name"`
	CityName        *string `json:"city"`

	Experience     float64 `json:"experience"`
	EmploymentName string  `json:"employment_name"`
	Salary         uint    `json:"salary"`
}

func CreateResume(c *gin.Context) {
	var resume ResumeCreate
	var categoryID, subcategoryID, employmentID, cityID, userID *int

	cfg := config.LoadDataBaseConfig()

	dsn := "host=" + cfg.Host + " user=" + cfg.User + " password=" + cfg.Password + " dbname=" + cfg.DBName + " sslmode=require"

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Println("Помилка підключення до бази даних:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Помилка запиту до бази даних"})
		return
	}
	defer db.Close()

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
