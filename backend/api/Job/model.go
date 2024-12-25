package job

import (
	"database/sql"
	"time"

	"github.com/lib/pq"
)

type Job struct {
	ID              uint           `json:"id"`
	CreatorID       uint           `json:"creator_id"`
	Title           string         `json:"title"`
	Description     string         `json:"description"`
	Requirements    string         `json:"requirements"`
	Offer           string         `json:"offer"`
	CategoryName    string         `json:"category_name"`
	SubcategoryName *string        `json:"subcategory_name"`
	Keywords        pq.StringArray `json:"keywords"`
	CityName        *string        `json:"city_name"`
	Experience      float64        `json:"experience"`
	EmploymentName  string         `json:"employment_name"`
	SalaryFrom      *uint          `json:"salary_from"`
	SalaryTo        *uint          `json:"salary_to"`
	CreatedAt       time.Time      `json:"created_at"`
	UpdatedAt       time.Time      `json:"updated_at"`
	CompanyID       uint           `json:"company_id"`
	CompanyName     string         `json:"company_name"`
	AboutUs         string         `json:"about_us"`
	ImageUrl        string         `json:"image_url"`
	WebSite         string         `json:"website"`
	Status          sql.NullString `json:"status"`
	ApplicationID   *uint          `json:"application_id"`
	OfferID         *uint          `json:"offer_id"`
}

type JobCreate struct {
	Job
	Email    string  `json:"email"`
	CityName *string `json:"city"`
}
