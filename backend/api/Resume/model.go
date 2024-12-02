package resume

import (
	"database/sql"
	"time"
)

type ResumeStruct struct{}

type Resume struct {
	ID             *uint   `json:"id"`
	CreatorID      uint    `json:"creator_id"`
	Title          string  `json:"title"`
	WorkExperience string  `json:"work_experience"`
	Achievements   *string `json:"achievements"`

	CategoryName    string  `json:"category_name"`
	SubcategoryName *string `json:"subcategory_name"`

	CityName *string `json:"city_name"`

	Experience float64 `json:"experience"`

	EmploymentName string `json:"employment_name"`

	Salary    *uint          `json:"salary"`
	CreatedAt *time.Time     `json:"created_at"`
	UpdatedAt *time.Time     `json:"updated_at"`
	Status    sql.NullString `json:"status"`
}

type ResumeCreate struct {
	ID             uint   `json:"id"`
	Email          string `json:"email"`
	Title          string `json:"title"`
	WorkExperience string `json:"work_experience"`
	Achievements   string `json:"achievements"`

	CategoryName    string  `json:"category_name"`
	SubcategoryName *string `json:"subcategory_name"`
	CityName        *string `json:"city"`

	Experience     float64 `json:"experience"`
	EmploymentName string  `json:"employment_name"`
	Salary         uint    `json:"salary"`
}
