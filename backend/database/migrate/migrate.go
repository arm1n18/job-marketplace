package main

import (
	"log"

	"backend/database"

	"backend/config"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func MigrateDatabase() {
	cfg := config.LoadDataBaseConfig()

	dsn := "host=" + cfg.Host + " user=" + cfg.User + " password=" + cfg.Password + " dbname=" + cfg.DBName + " sslmode=require"

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Ошибка подключения к Vercel:", err)
	}

	err = db.AutoMigrate(
		&database.User{},
		&database.Job{},
		&database.Resume{},
		&database.JobApplication{},
		&database.ResumeApplication{},
		&database.Category{},
		&database.Subcategory{},
		&database.Keyword{},
		&database.City{},
		&database.Employment{},
	)
	if err != nil {
		log.Fatalf("Ошибка миграции базы данных: %v", err)
	}

	log.Println("База данных создана")
}

func main() {
	MigrateDatabase()
}
