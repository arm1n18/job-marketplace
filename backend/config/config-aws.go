package config

import (
	"fmt"
	"log"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/joho/godotenv"
)

func LoadAwsConfig() (aws.Config, error) {
	if err := godotenv.Load(".env"); err != nil {
		log.Printf("Ошибка загрузки .env файла: %v", err)
	} else {
		log.Printf("Файл .env загружен успешно.")
	}

	region := os.Getenv("AWS_REGION")
	accessKeyID := os.Getenv("AWS_ACCESS_KEY_ID")
	secretAccessKey := os.Getenv("AWS_SECRET_ACCESS_KEY")

	if region == "" || accessKeyID == "" || secretAccessKey == "" {
		return aws.Config{}, fmt.Errorf("Відсутні: AWS_REGION, AWS_ACCESS_KEY_ID, или AWS_SECRET_ACCESS_KEY")
	}

	cfg := aws.Config{
		Region:      aws.String(region),
		Credentials: credentials.NewStaticCredentials(accessKeyID, secretAccessKey, ""),
		LogLevel:    aws.LogLevel(aws.LogDebugWithRequestRetries | aws.LogDebugWithRequestErrors),
	}

	return cfg, nil
}
