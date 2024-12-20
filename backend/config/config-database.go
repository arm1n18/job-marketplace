package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Host     string
	User     string
	Password string
	DBName   string
}

func LoadDataBaseConfig() *Config {
	if err := godotenv.Load(".env"); err != nil {
		log.Fatalf("Ошибка загрузки .env файла: %v", err)
	}

	return &Config{
		Host:     os.Getenv("POSTGRES_HOST"),
		User:     os.Getenv("POSTGRES_USER"),
		Password: os.Getenv("POSTGRES_PASSWORD"),
		DBName:   os.Getenv("POSTGRES_DATABASE"),
	}
}

//"../../.env" - for migrate
