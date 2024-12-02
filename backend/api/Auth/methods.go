package auth

import (
	"backend/config"
	"backend/database"
	"backend/services"
	"database/sql"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
)

func (a *Auth) Login(c *gin.Context) {
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

func (a *Auth) LogOut(c *gin.Context) {
	c.SetCookie("refresh_token", "", -1, "/", "192.168.0.106", false, true)
	c.JSON(200, gin.H{
		"message": "Выход выполнен",
	})
}

func (a *Auth) Register(c *gin.Context) {
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

func (a *Auth) RefreshToken(c *gin.Context) {
	if err := godotenv.Load(".env"); err != nil {
		log.Fatalf("Ошибка загрузки .env файла: %v", err)
	}

	secretKey := os.Getenv("SECRET_KEY")

	refreshToken, err := c.Cookie("refresh_token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Refresh token not found"})
		return
	}

	log.Printf("Received refresh token: %s", refreshToken)

	claims := &jwt.MapClaims{}
	token, err := jwt.ParseWithClaims(refreshToken, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(secretKey), nil
	})

	if err != nil || !token.Valid {
		log.Printf("Invalid refresh token: %v", err)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid refresh token"})
		return
	}

	exp, ok := (*claims)["exp"].(float64)
	if !ok || time.Now().Unix() > int64(exp) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Refresh token has expired"})
		return
	}

	userID, ok := (*claims)["id"].(float64)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
		return
	}

	userEmail, ok := (*claims)["email"].(string)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
		return
	}

	userRole, ok := (*claims)["role"].(string)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
		return
	}

	cfg := config.LoadDataBaseConfig()
	dsn := "host=" + cfg.Host + " user=" + cfg.User + " password=" + cfg.Password + " dbname=" + cfg.DBName + " sslmode=require"

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Println("Помилка підключення до бази даних:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Помилка запиту до бази даних"})
		c.Abort()
		return
	}
	defer db.Close()

	query := `SELECT EXISTS(SELECT 1 FROM "User" WHERE "id" = $1 AND "email" = $2 AND "role" = $3)`
	var exists bool

	err = db.QueryRow(query, userID, userEmail, userRole).Scan(&exists)
	if err != nil {
		log.Printf("Database query error: %v", err)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		c.Abort()
		return
	}

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	newAccessToken, err := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":    userID,
		"email": userEmail,
		"role":  userRole,
		"exp":   time.Now().Add(time.Minute * 30).Unix(),
		"iat":   time.Now().Unix(),
	}).SignedString([]byte(secretKey))

	if err != nil {
		log.Printf("Error signing new access token: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create new access token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": newAccessToken})
}
