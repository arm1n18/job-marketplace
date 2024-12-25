package profile

import (
	resume "backend/api/Resume"
	"backend/config"
	"context"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gofiber/fiber/v2"
)

func GetCandidateProfile(c *fiber.Ctx, db *sql.DB) error {
	var candidateProfile resume.Resume
	userID := c.Locals("userID")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	query := `
	SELECT r.ID, r.creator_id, r.Title, r.work_experience AS WorkExperience, r.Achievements,
	       c.Name AS CategoryName,
	       s.Name AS SubcategoryName,
		   r.key_words,
	       ct.Name AS CityName,
	       r.Experience, e.Name AS EmploymentName,
	       r.salary
	FROM "Resume" r
	LEFT JOIN "Category" c ON r.category_id = c.ID
	LEFT JOIN "Subcategory" s ON r.subcategory_id = s.ID
	LEFT JOIN "City" ct ON r.city_id = ct.ID
	LEFT JOIN "Employment" e ON r.employment_id = e.ID
	WHERE r.creator_id = $1
	`

	rows, err := db.QueryContext(ctx, query, userID)
	if err != nil {
		log.Println("Помилка виконання запиту:", err)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Помилка виконання запиту до бази даних"})
	}
	defer rows.Close()

	if rows.Next() {
		err := rows.Scan(&candidateProfile.ID, &candidateProfile.CreatorID, &candidateProfile.Title, &candidateProfile.WorkExperience, &candidateProfile.Achievements,
			&candidateProfile.CategoryName, &candidateProfile.SubcategoryName, &candidateProfile.Keywords, &candidateProfile.CityName, &candidateProfile.Experience,
			&candidateProfile.EmploymentName, &candidateProfile.Salary)
		if err != nil {
			log.Println("Помилка під час сканування рядка:", err)
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Помилка під час отриання данних резюме"})
		}
	} else {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "Резюме не найдено"})
	}

	return c.Status(fiber.StatusOK).JSON(candidateProfile)
}

func GetCompanyProfile(c *fiber.Ctx, db *sql.DB) error {
	var companyProfile CompanyProfile
	userID := c.Locals("userID")

	query := `SELECT "company_name", "about_us", "web_site", "linkedin", "facebook",
		"recruiter_name", "phone_number" FROM "Company" WHERE "recruiter_id" = $1`

	rows, err := db.Query(query, userID)
	if err != nil {
		log.Println("Помилка виконання запиту:", err)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Помилка виконання запиту до бази даних"})
	}

	defer rows.Close()

	if rows.Next() {
		err = rows.Scan(&companyProfile.CompanyName, &companyProfile.AboutUs, &companyProfile.WebSite, &companyProfile.LinkedIn,
			&companyProfile.Facebook, &companyProfile.RecruiterName, &companyProfile.PhoneNumber)
		if err != nil {
			log.Println("Помилка під час сканування рядка:", err)
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Помилка під час отриання данних компанії"})
		}
	} else {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "Компанія не знайдена"})
	}

	return c.Status(fiber.StatusOK).JSON(companyProfile)
}

func (p *Profile) GetUserProfile(c *fiber.Ctx, db *sql.DB) error {
	userRole := c.Locals("userRole")

	if userRole == "CANDIDATE" {
		GetCandidateProfile(c, db)
	} else if userRole == "RECRUITER" {
		GetCompanyProfile(c, db)
	}

	return nil
}

func (p *Profile) GetAvatar(c *fiber.Ctx) error {
	userID := c.Locals("userID")
	cfg := config.LoadDataBaseConfig()
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s sslmode=require", cfg.Host, cfg.User, cfg.Password, cfg.DBName)

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Println("Помилка підключення до бази даних:", err)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Помилка запиту до бази даних"})
	}
	defer db.Close()

	var imageURL string
	_ = db.QueryRow(`SELECT "image_url" FROM "Company" WHERE "recruiter_id" = $1`, userID).Scan(&imageURL)

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"image_url": imageURL})
}
