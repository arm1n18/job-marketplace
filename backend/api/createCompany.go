package api

import (
	"backend/config"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func CreateCompany(c *gin.Context) {
	recruiterID := c.DefaultPostForm("recruiter_id", "")
	recruiterName := c.DefaultPostForm("recruiter_name", "")
	companyName := c.DefaultPostForm("company_name", "")
	aboutUs := c.DefaultPostForm("about_us", "")
	website := c.DefaultPostForm("web_site", "")
	linkedin := c.DefaultPostForm("linkedin", "")
	facebook := c.DefaultPostForm("facebook", "")
	phone := c.DefaultPostForm("phone", "")

	avatarFile, err := c.FormFile("avatar")
	var avatarURL string
	if err != nil && err.Error() != "http: no such file" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process avatar file"})
		return
	}

	if avatarFile != nil {
		avatarURL, err = UploadPhoto(avatarFile, companyName)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to upload photo to S3: %v", err)})
			return
		}
	}

	cfg := config.LoadDataBaseConfig()
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s sslmode=require", cfg.Host, cfg.User, cfg.Password, cfg.DBName)

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Println("Error connecting to the database:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database connection error"})
		return
	}
	defer db.Close()

	phoneNumber, err := strconv.Atoi(phone)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid phone number format"})
		return
	}

	query := `INSERT INTO "Company" ("recruiter_id", "company_name", "about_us", "image_url", 
		"web_site", "linkedin", "facebook", "phone_number", "recruiter_name", "created_at", "updated_at")
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW()) RETURNING "id"`

	var companyID uint

	err = db.QueryRow(query, recruiterID, companyName, aboutUs, avatarURL, website, linkedin, facebook, phoneNumber, recruiterName).Scan(&companyID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Error inserting company into database: %v", err)})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":    "Company created successfully",
		"avatar_url": avatarURL,
	})
}
