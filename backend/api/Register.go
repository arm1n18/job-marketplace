package api

import (
	"backend/config"
	"backend/database"
	"backend/services"
	"database/sql"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

type UserRegister struct {
	Email    string        `json:"email" binding:"required,email"`
	Password string        `json:"password" binding:"required"`
	Role     database.Role `json:"role" binding:"required"`
}

func Register(c *gin.Context) {
	var user UserRegister

	cfg := config.LoadDataBaseConfig()
	dsn := "host=" + cfg.Host + " user=" + cfg.User + " password=" + cfg.Password + " dbname=" + cfg.DBName + " sslmode=require"

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Println("Помилка підключення до бази даних:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Помилка запиту до бази даних"})
		return
	}
	defer db.Close()

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	valid, err := services.CheckValidUser(db, user.Email, user.Role)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if !valid {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Пользователь с таким email уже существует или некорректная роль"})
		return
	}

	hash, _ := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)

	query := `INSERT INTO "User" ("email", "password", "role","created_at", "updated_at")
		VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id`

	var userID int
	err = db.QueryRow(query, user.Email, hash, user.Role).Scan(&userID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	accessToken, refreshToken, err := services.CreateToken(userID, user.Email, user.Role, true)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		log.Println(err)
		return
	}

	query = `
		INSERT INTO "Tokens" (user_id, refresh_token, created_at, expires_at)
		VALUES ($1, $2, NOW(), NOW() + INTERVAL '30 day')`

	_, err = db.Exec(query, userID, refreshToken)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	services.SetCookie(c, refreshToken)
	log.Println(accessToken)
	c.JSON(http.StatusOK, gin.H{"token": accessToken})
}
