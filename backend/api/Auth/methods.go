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

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
)

func (a *Auth) Login(c *fiber.Ctx) error {
	var user UserLogin

	cfg := config.LoadDataBaseConfig()
	dsn := "host=" + cfg.Host + " user=" + cfg.User + " password=" + cfg.Password + " dbname=" + cfg.DBName + " sslmode=require"

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Println("Помилка підключення до бази даних:", err)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": "Помилка запиту до бази даних",
		})
	}
	defer db.Close()

	if err := c.BodyParser(&user); err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	// log.Print(user)

	// hash, _ := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)

	userID, userRole, err := services.IsUserExists(db, user.Email, user.Password)
	if err != nil || userID == 0 {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{
			"error": "Некоректна пошта або пароль",
		})
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
		return nil
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
			log.Println(err)
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		query = `
		INSERT INTO "Tokens" (user_id, refresh_token, created_at, expires_at)
		VALUES ($1, $2, NOW(), NOW() + INTERVAL '30 day')`
		_, err = db.Exec(query, userID, newRefreshtoken)

		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		services.SetCookie(c, newRefreshtoken)
		return c.Status(http.StatusOK).JSON(fiber.Map{
			"token": accessToken,
		})
	}

	accessToken, _, err := services.CreateToken(userID, user.Email, database.Role(userRole), false)
	if err != nil {
		log.Println(err)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	services.SetCookie(c, refreshToken)
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"token": accessToken,
	})
}

func (a *Auth) LogOut(c *fiber.Ctx) error {
	c.Cookie(&fiber.Cookie{
		Name:    "refresh_token",
		Value:   "",
		Expires: time.Now().Add(-time.Hour),
	})

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Выход выполнен",
	})
}

func (a *Auth) Register(c *fiber.Ctx) error {
	var user UserRegister

	cfg := config.LoadDataBaseConfig()
	dsn := "host=" + cfg.Host + " user=" + cfg.User + " password=" + cfg.Password + " dbname=" + cfg.DBName + " sslmode=require"

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Println("Помилка підключення до бази даних:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Помилка запиту до бази даних",
		})
	}
	defer db.Close()

	if err := c.BodyParser(&user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	valid, err := services.CheckValidUser(db, user.Email, user.Role)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	if !valid {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Користувач із таким email вже існує або некоректна роль",
		})
	}

	hash, _ := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)

	query := `INSERT INTO "User" ("email", "password", "role","created_at", "updated_at")
		VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id`

	var userID int
	err = db.QueryRow(query, user.Email, hash, user.Role).Scan(&userID)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	accessToken, refreshToken, err := services.CreateToken(userID, user.Email, user.Role, true)
	if err != nil {
		log.Println(err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	query = `
		INSERT INTO "Tokens" (user_id, refresh_token, created_at, expires_at)
		VALUES ($1, $2, NOW(), NOW() + INTERVAL '30 day')`

	_, err = db.Exec(query, userID, refreshToken)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	services.SetCookie(c, refreshToken)
	log.Println(accessToken)

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"token": accessToken,
	})
}

func (a *Auth) RefreshToken(c *fiber.Ctx) error {
	if err := godotenv.Load(".env"); err != nil {
		log.Fatalf("Ошибка загрузки .env файла: %v", err)
	}

	secretKey := os.Getenv("SECRET_KEY")

	refreshToken := c.Cookies("refresh_token")
	if refreshToken == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Refresh token not found",
		})
	}

	log.Printf("Received refresh token: %s", refreshToken)

	claims := &jwt.MapClaims{}
	token, err := jwt.ParseWithClaims(refreshToken, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(secretKey), nil
	})

	if err != nil || !token.Valid {
		log.Printf("Invalid refresh token: %v", err)
		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid refresh token",
		})
	}

	exp, ok := (*claims)["exp"].(float64)
	if !ok || time.Now().Unix() > int64(exp) {
		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{
			"error": "Refresh token has expired",
		})
	}

	userID, ok := (*claims)["id"].(float64)
	if !ok {
		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid token claims",
		})
	}

	userEmail, ok := (*claims)["email"].(string)
	if !ok {
		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid token claims",
		})
	}

	userRole, ok := (*claims)["role"].(string)
	if !ok {
		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid token claims",
		})
	}

	cfg := config.LoadDataBaseConfig()
	dsn := "host=" + cfg.Host + " user=" + cfg.User + " password=" + cfg.Password + " dbname=" + cfg.DBName + " sslmode=require"

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Println("Помилка підключення до бази даних:", err)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": "Помилка запиту до бази даних",
		})
	}
	defer db.Close()

	query := `SELECT EXISTS(SELECT 1 FROM "User" WHERE "id" = $1 AND "email" = $2 AND "role" = $3)`
	var exists bool

	err = db.QueryRow(query, userID, userEmail, userRole).Scan(&exists)
	if err != nil {
		log.Printf("Database query error: %v", err)
		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unauthorized",
		})
	}

	if !exists {
		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unauthorized",
		})
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
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not create new access token",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"token": newAccessToken,
	})
}
