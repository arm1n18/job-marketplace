package api

import (
	"backend/config"
	"backend/database"
	"backend/services"
	"database/sql"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"github.com/joho/godotenv"
)

type UserLogin struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

func Login(c *gin.Context) {
	var user UserLogin

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

	// log.Print(user)

	// hash, _ := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)

	userID, userRole, err := services.IsUserExists(db, user.Email, user.Password)
	if err != nil || userID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Некоректна пошта або пароль"})
		return
	}

	query := `SELECT "refresh_token" FROM "Tokens" WHERE "user_id" = $1`

	var refreshToken string
	log.Printf("Запрос к базе данных для userID: %d", userID)
	err = db.QueryRow(query, userID).Scan(&refreshToken)
	if err != nil {
		if err == sql.ErrNoRows {
			log.Println("Токен не найден для пользователя:", userID)
		} else {
			log.Println("Ошибка при выполнении запроса:", err)
		}
		return
	}
	log.Printf("Найденный refreshToken: %s", refreshToken)

	if err := godotenv.Load(".env"); err != nil {
		log.Fatalf("Ошибка загрузки .env файла: %v", err)
	}

	secretKey := os.Getenv("SECRET_KEY")
	claims := &jwt.MapClaims{}

	var parsedToken *jwt.Token

	parsedToken, _ = jwt.ParseWithClaims(refreshToken, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(secretKey), nil
	})

	if parsedToken == nil || !parsedToken.Valid || refreshToken == "" {
		accessToken, newRefreshtoken, err := services.CreateToken(userID, user.Email, database.Role(userRole), true)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			log.Println(err)
			return
		}

		query = `
		INSERT INTO "Tokens" (user_id, refresh_token, created_at, expires_at)
		VALUES ($1, $2, NOW(), NOW() + INTERVAL '30 day')`
		_, err = db.Exec(query, userID, newRefreshtoken)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		services.SetCookie(c, newRefreshtoken)
		c.JSON(http.StatusOK, gin.H{"token": accessToken})
		return
	}

	accessToken, _, err := services.CreateToken(userID, user.Email, database.Role(userRole), false)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		log.Println(err)
		return
	}

	services.SetCookie(c, refreshToken)
	c.JSON(http.StatusOK, gin.H{"token": accessToken})
}
