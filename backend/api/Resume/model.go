package resume

import (
	"database/sql"
	"time"

	"github.com/lib/pq"
)

type ResumeStruct struct{}

type Resume struct {
	ID              *uint          `json:"id"`
	CreatorID       uint           `json:"creator_id"`
	Title           string         `json:"title"`
	WorkExperience  string         `json:"work_experience"`
	Achievements    *string        `json:"achievements"`
	CategoryName    string         `json:"category_name"`
	SubcategoryName *string        `json:"subcategory_name"`
	Keywords        pq.StringArray `json:"keywords"`
	CityName        *string        `json:"city"`
	Experience      float64        `json:"experience"`
	EmploymentName  string         `json:"employment_name"`
	Salary          *uint          `json:"salary"`
	CreatedAt       *time.Time     `json:"created_at"`
	UpdatedAt       *time.Time     `json:"updated_at"`
	Status          sql.NullString `json:"status"`
}

type ResumeCreate struct {
	Resume
	Email string `json:"email"`
}
