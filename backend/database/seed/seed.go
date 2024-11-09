package main

import (
	"database/sql"
	"log"

	"backend/config"

	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	cfg := config.LoadDataBaseConfig()

	dsn := "host=" + cfg.Host + " user=" + cfg.User + " password=" + cfg.Password + " dbname=" + cfg.DBName + " sslmode=require"

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Fatal("Помилка підключення до бази даних:", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatal("Помилка [PING] до бази даних:", err)
	}

	// Вставка пользователя
	hash, _ := bcrypt.GenerateFromPassword([]byte("333"), bcrypt.DefaultCost)

	sqlStatement := `INSERT INTO "User" (email, password, role, created_at, updated_at)
	VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`

	_, err = db.Exec(sqlStatement, "test3@gmail.com", hash, "CANDIDATE")
	if err != nil {
		log.Fatalf("Помилка вставки даних: %v", err)
	}

	// Категорий и под категорий

	// sqlCategory := `INSERT INTO "Category" (name, created_at, updated_at)
	// VALUES
	// ('JavaScript / Front-End', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
	// _, err = db.Exec(sqlCategory)
	// if err != nil {
	// 	log.Fatalf("Помилка вставки даних: %v", err)
	// }

	// var categoryID int
	// err = db.QueryRow(`SELECT id FROM "Category" WHERE name = $1`, "C / C++ / Embedded").Scan(&categoryID)
	// if err != nil {
	// 	log.Fatalf("Ошибка при получении ID категории: %v", err)
	// }

	// subcategories := []string{"C", "C++", "Embedded"}
	// for _, subcategory := range subcategories {
	// 	sqlSubcategories := `INSERT INTO "Subcategory" (name, category_id, created_at, updated_at)
	// 	VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`

	// 	_, err = db.Exec(sqlSubcategories, subcategory, categoryID)

	// 	if err != nil {
	// 		log.Fatalf("Ошибка вставки подкатегории: %v", err)
	// 	}

	// }

	// cities := []string{"Київ", "Одеса", "Харків", "Львів"}
	// for _, subcategory := range cities {
	// 	sqlSubcategories := `INSERT INTO "City" (name, created_at, updated_at)
	// 	VALUES ($1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`

	// 	_, err = db.Exec(sqlSubcategories, subcategory)

	// 	if err != nil {
	// 		log.Fatalf("Ошибка вставки подкатегории: %v", err)
	// 	}

	// }

	log.Println("Данные успешно вставлены!")
}
