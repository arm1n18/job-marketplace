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

	CategoryName    string `json:"category_name"`
	SubcategoryName string `json:"subcategory_name"`
	CityName        string `json:"city"`

	Experience     float64 `json:"experience"`
	EmploymentName string  `json:"employment_name"`
	Salary         uint    `json:"salary"`
}

func CreateResume(c *gin.Context) {
	var resume ResumeCreate
	var categoryID, subcategoryID, employmentID, cityID, userID int

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

	query := `
    SELECT c.ID, s.ID, e.ID, ci.ID, u.ID
    FROM "Category" c
    JOIN "Subcategory" s ON s.category_id = c.ID
    JOIN "Employment" e ON e.Name = $1
    JOIN "City" ci ON ci.Name = $2
    JOIN "User" u ON u.Email = $3
    WHERE c.Name = $4 AND s.Name = $5`

	rows, err := db.Query(query, resume.EmploymentName, resume.CityName, resume.Email, resume.CategoryName, resume.SubcategoryName)

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

	log.Printf("Searching for Category: %s, Subcategory: %s, Employment: %s, City: %s, User Email: %s",
		resume.CategoryName, resume.SubcategoryName, resume.EmploymentName, resume.CityName, resume.Email)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	query = `INSERT INTO "Resume" ("creator_id", "title", "work_experience", "achievements",
			"category_id", "subcategory_id", "city_id", "experience", "employment_id", "salary", "created_at", "updated_at")
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW()) RETURNING id`

	var resumeID int
	err = db.QueryRow(query, userID, resume.Title, resume.WorkExperience, resume.Achievements,
		categoryID, subcategoryID, cityID, resume.Experience, employmentID, resume.Salary).Scan(&resumeID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"id": resumeID})
}
