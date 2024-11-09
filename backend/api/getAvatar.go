package api

import (
	"backend/config"
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type RecruiterID struct {
	RecruiterID uint `json:"recruiter_id"`
}

func GetAvatar(c *gin.Context) {
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
	err = db.QueryRow(`SELECT "image_url" FROM "Company" WHERE "recruiter_id" = $1`, userID).Scan(&imageURL)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve image URL"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"image_url": imageURL})
}
