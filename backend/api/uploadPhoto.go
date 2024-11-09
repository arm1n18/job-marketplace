package api

import (
	"backend/config"
	"bytes"
	"fmt"
	"log"
	"mime/multipart"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
)

func UploadPhoto(file *multipart.FileHeader, companyName string) (string, error) {
	log.Print("Вошли в UploadPhoto")

	cfg, err := config.LoadAwsConfig()
	if err != nil {
		log.Printf("Ошибка при загрузке конфигурации AWS: %v", err)
		return "", fmt.Errorf("failed to load AWS config: %v", err)
	}

	s3Client := s3.New(session.Must(session.NewSession(&cfg)))

	fileContent, err := file.Open()
	if err != nil {
		log.Printf("Ошибка при открытии файла: %v", err)
		return "", fmt.Errorf("failed to open file: %v", err)
	}
	defer fileContent.Close()

	buf := new(bytes.Buffer)
	_, err = buf.ReadFrom(fileContent)
	if err != nil {
		log.Printf("Ошибка при чтении файла в буфер: %v", err)
		return "", fmt.Errorf("failed to read file: %v", err)
	}

	filename := fmt.Sprintf("%s_avatar_%d", companyName, time.Now().Unix())
	key := "uploads/" + filename
	log.Printf("Сгенерировано имя файла для загрузки в S3: %s", filename)

	contentType := "image/jpeg"

	uploadInput := &s3.PutObjectInput{
		Bucket:      aws.String("jooblyua"),
		Key:         aws.String(key),
		Body:        bytes.NewReader(buf.Bytes()),
		ContentType: aws.String(contentType),
	}

	log.Print("Загрузка файла в S3...")
	_, err = s3Client.PutObject(uploadInput)
	if err != nil {
		log.Printf("Ошибка при загрузке файла в S3: %v", err)
		return "", fmt.Errorf("failed to upload file to S3: %v", err)
	}

	fileURL := fmt.Sprintf("https://%s.s3.amazonaws.com/%s", "jooblyua", key)
	log.Printf("Файл успешно загружен в S3. URL: %s", fileURL)

	return fileURL, nil
}
