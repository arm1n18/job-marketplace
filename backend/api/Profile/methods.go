package profile

import (
	resume "backend/api/Resume"
	"backend/config"
	"context"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func GetCandidateProfile(c *gin.Context, db *sql.DB) {
	var candidateProfile resume.Resume
	userID, _ := c.Get("userID")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	query := `
	SELECT r.ID, r.creator_id, r.Title, r.work_experience AS WorkExperience, r.Achievements,
	       c.Name AS CategoryName,
	       s.Name AS SubcategoryName,
	       ct.Name AS CityName,
	       r.Experience, e.Name AS EmploymentName,
	       r.salary
	FROM "Resume" r
	LEFT JOIN "Category" c ON r.category_id = c.ID
	LEFT JOIN "Subcategory" s ON r.subcategory_id = s.ID
	LEFT JOIN "City" ct ON r.city_id = ct.ID
	LEFT JOIN "Employment" e ON r.employment_id = e.ID
	WHERE r.creator_id = $1
	`

	rows, err := db.QueryContext(ctx, query, userID)
	if err != nil {
		log.Println("Помилка виконання запиту:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Помилка виконання запиту к базе данных"})
		return
	}
	defer rows.Close()

	if rows.Next() {
		err := rows.Scan(&candidateProfile.ID, &candidateProfile.CreatorID, &candidateProfile.Title, &candidateProfile.WorkExperience, &candidateProfile.Achievements,
			&candidateProfile.CategoryName, &candidateProfile.SubcategoryName, &candidateProfile.CityName, &candidateProfile.Experience,
			&candidateProfile.EmploymentName, &candidateProfile.Salary)
		if err != nil {
			log.Println("Помилка під час сканування рядка:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Помилка під час отриання данних резюме"})
			return
		}
	} else {
		c.JSON(http.StatusNotFound, gin.H{"error": "Резюме не найдено"})
		return
	}

	c.JSON(http.StatusOK, candidateProfile)
}

func GetCompanyProfile(c *gin.Context, db *sql.DB) {
	var companyProfile CompanyProfile
	userID, _ := c.Get("userID")

	query := `SELECT "company_name", "about_us", "web_site", "linkedin", "facebook",
		"recruiter_name", "phone_number" FROM "Company" WHERE "recruiter_id" = $1`

	rows, err := db.Query(query, userID)
	if err != nil {
		log.Println("Помилка виконання запиту:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Помилка виконання запиту к базе данных"})
		return
	}
	defer rows.Close()

	if rows.Next() {
		err = rows.Scan(&companyProfile.CompanyName, &companyProfile.AboutUs, &companyProfile.WebSite, &companyProfile.LinkedIn,
			&companyProfile.Facebook, &companyProfile.RecruiterName, &companyProfile.PhoneNumber)
		if err != nil {
			log.Println("Помилка під час сканування рядка:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Помилка під час отриання данних компанії"})
			return
		}
	} else {
		c.JSON(http.StatusNotFound, gin.H{"error": "Компанія не знайдена"})
		return
	}

	c.JSON(http.StatusOK, companyProfile)
}

func (p *Profile) GetUserProfile(c *gin.Context, db *sql.DB) {
	userRole, _ := c.Get("userRole")

	if userRole == "CANDIDATE" {
		GetCandidateProfile(c, db)
	} else if userRole == "RECRUITER" {
		GetCompanyProfile(c, db)
	}
}

func (p *Profile) GetAvatar(c *gin.Context) {
	userID, _ := c.Get("userID")
	cfg := config.LoadDataBaseConfig()
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s sslmode=require", cfg.Host, cfg.User, cfg.Password, cfg.DBName)

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Println("Помилка підключення до бази даних:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Помилка запиту до бази даних"})
		return
	}
	defer db.Close()

	var imageURL string
	_ = db.QueryRow(`SELECT "image_url" FROM "Company" WHERE "recruiter_id" = $1`, userID).Scan(&imageURL)

	c.JSON(http.StatusOK, gin.H{"image_url": imageURL})
}
