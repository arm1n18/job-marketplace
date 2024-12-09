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
		log.Fatal("Помилка підключення до бази даних:", err)
	}

	err = db.AutoMigrate(
		&database.Job{},
	)
	if err != nil {
		log.Fatalf("Ошибка миграции базы данных: %v", err)
	}

	log.Println("База данных создана")
}

func DeleteColumns() error {
	cfg := config.LoadDataBaseConfig()

	dsn := "host=" + cfg.Host + " user=" + cfg.User + " password=" + cfg.Password + " dbname=" + cfg.DBName + " sslmode=require"

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Помилка підключення до бази даних:", err)
	}

	columnsToDelete := []string{"updated_at"}

	for _, column := range columnsToDelete {
		if err := db.Migrator().DropColumn(&database.Company{}, column); err != nil {
			log.Fatalf("не удалось удалить колонку %s: %v", column, err)
		}
		// if err := db.Migrator().RenameColumn(&database.Company{}, column, "linkedin"); err != nil {
		// 	log.Fatalf("не удалось удалить колонку %s: %v", column, err)
		// }
	}

	return nil
}

func main() {
	MigrateDatabase()
}
