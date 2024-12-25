package api

import (
	"fmt"
	"log"
	"net/http"
	"net/smtp"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
)

type Backend struct{}

type Body struct {
	ID                uint   `json:"id"`
	Title             string `json:"title"`
	CompanyName       string `json:"company_name"`
	ImageUrl          string `json:"image_url"`
	Salary            string `json:"salary"`
	Description       string `json:"description"`
	CityAndExperience string `json:"city_and_experience"`
}

type Email struct {
	To      string `json:"to"`
	Subject string `json:"subject"`
	Body    Body   `json:"body"`
}

func SendEmail(c *fiber.Ctx) error {
	var email Email

	if err := godotenv.Load(); err != nil {
		log.Fatal("Ошибка загрузки .env файла")
	}

	domenConfig := os.Getenv("DOMEN")
	emailConfig := os.Getenv("EMAIL")
	passwordConfig := os.Getenv("PASSWORD")

	if err := c.BodyParser(&email); err != nil {
		log.Println(email)
		log.Println("Error parsing email data:", err)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	auth := smtp.PlainAuth("", domenConfig, passwordConfig, "smtp.gmail.com")

	to := []string{email.To}

	subject := fmt.Sprintf("Subject: %s\r\n", email.Subject)
	contentType := "Content-Type: text/html; charset=UTF-8\r\n"
	body := fmt.Sprintf(`<html>
	<head>
		<title>Ви отримали пропозицію</title>
		<style>
		body { font-family: Arial, sans-serif}
		html, body {
			margin: 0;
			padding: 0;
			width: 100vh;
			height: 100vh;
		}
		.container { width: 100vh; max-width: 384px; margin: 0 auto; padding: 8px 0px 0px 0px }
		.message { margin-top: 20px; padding: 16px 16px 24px 16px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 10px}
		.link { color: #1C64EE;   font-size: 16px; font-weight: 600; text-decoration: none}
		.text { color: #667085; font-size: 14px; font-weight: 400; margin: 0 }
		.avatar { height: 64px; width: 64px; border-radius: 8px}
		.vacancy { display: flex; margin: 24px 0px 8px 0px }
		.button { background-color: #1C64EE; color: white; padding: 12px;  font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 6px }
		.footer { text-align: center; font-size: 12px; color: #888; margin-top: 20px; }
		</style>
	</head>
	<body>
		<div class="container">
			<img src="https://jooblyua.s3.eu-north-1.amazonaws.com/JooblyUa.png" style="height: 24px" alt="JooblyUa.logo" />
			<div class="message">
				<p class="text">Вам запропонували вакансію на посаду</p>
				<div class="vacancy">
					<img class="avatar" style="margin: 0 8px 0 0" src="%s" alt="avatar" />
					<div class="title">
						<a class="link" href="http://192.168.0.106:3000/jobs/%d">%s<span class="text"> у компанії %s</span></a>
						<p class="text" style="margin-top: 2px">%s</p>
					</div>
				</div>
				<span style="color: #037847; font-size: 16px; font-weight: 600">%s</span>
				<p class="text" style="margin: 8px 0 24px 0;">%s</p>
				<a href="http://192.168.1.1:3000/jobs/%d" class="button">Переглянути вакансію</a>
			</div>
			<div class="footer">
				<p>Цей лист надіслано автоматично, будь ласка, не відповідайте на нього.</p>
			</div>
		</div>
	</body>
</html>`, email.Body.ImageUrl, email.Body.ID, email.Body.Title, email.Body.CompanyName, email.Body.CityAndExperience, email.Body.Salary, email.Body.Description, email.Body.ID)

	msg := []byte(fmt.Sprintf("To: %s\r\n%s%s\r\n%s", email.To, subject, contentType, body))

	err := smtp.SendMail("smtp.gmail.com:587", auth, emailConfig, to, msg)
	if err != nil {
		log.Print(err)
		return err
	}

	log.Print("Email sent successfully, to: ", to)
	return nil
}
