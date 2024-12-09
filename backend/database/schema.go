package database

import "time"

type User struct {
	ID uint `json:"id" gorm:"unique;primaryKey;autoIncrement"`

	Email    string `json:"email" gorm:"unique"`
	Password string `json:"password"`
	Role     Role   `json:"role"`

	CreatedAt time.Time
	UpdatedAt time.Time
}

func (User) TableName() string {
	return "User"
}

type Tokens struct {
	ID uint `json:"id" gorm:"unique;primaryKey;autoIncrement"`

	UserID uint `json:"user_id" gorm:"index"`
	User   User `json:"user" gorm:"foreignKey:UserID"`

	RefreshToken string `json:"token" gorm:"unique"`

	CreatedAt time.Time
	ExpiresAt time.Time
}

func (Tokens) TableName() string {
	return "Tokens"
}

type Company struct {
	ID uint `json:"id" gorm:"unique;primaryKey;autoIncrement"`

	RecruiterName string `json:"recruiter_name"`
	RecruiterID   uint   `json:"recruiter_id" gorm:"index"`
	Recruiter     User   `json:"recruiter" gorm:"foreignKey:RecruiterID"`

	CompanyName string `json:"company_name"`
	PhoneNumber uint   `json:"phone_number"`
	AboutUs     string `json:"about_us"`
	ImageUrl    string `json:"image_url" gorm:"unique"`

	WebSite  string `json:"website"`
	Linkedin string `json:"linkedin"`
	Facebook string `json:"facebook"`

	CreatedAt time.Time
	UpdatedAt time.Time
}

func (Company) TableName() string {
	return "Company"
}

type Job struct {
	ID uint `json:"id" gorm:"unique;primaryKey;autoIncrement"`

	CreatorID uint `json:"creator_id" gorm:"index"`
	Creator   User `json:"creator" gorm:"foreignKey:CreatorID"`

	CompanyID uint    `json:"company_id" gorm:"index"`
	Company   Company `json:"company" gorm:"foreignKey:CompanyID"`

	Title        string `json:"title"`
	Description  string `json:"description"`
	Requirements string `json:"requirements"`
	Offer        string `json:"offer"`

	CategoryID uint     `json:"category_id" gorm:"index"`
	Category   Category `json:"category" gorm:"foreignKey:CategoryID"`

	SubcategoryID *uint        `json:"subcategory_id" gorm:"index"`
	Subcategory   *Subcategory `json:"subcategory" gorm:"foreignKey:SubcategoryID"`

	KeyWords *[]Keyword `json:"keywords" gorm:"foreignKey:JobID"`

	SalaryFrom uint `json:"salary_from"`
	SalaryTo   uint `json:"salary_to"`

	CityID *uint `json:"city_id" gorm:"index"`
	City   *City `json:"city" gorm:"foreignKey:CityID"`

	Experience float64 `json:"experience"`

	EmploymentID uint       `json:"employment_id" gorm:"index"`
	Employment   Employment `json:"employment" gorm:"foreignKey:EmploymentID"`

	Inactive bool `json:"inactive"`

	CreatedAt time.Time
	UpdatedAt time.Time
}

func (Job) TableName() string {
	return "Job"
}

type Resume struct {
	ID uint `json:"id" gorm:"unique;primaryKey;autoIncrement"`

	CreatorID uint `json:"creator_id" gorm:"index"`
	Creator   User `json:"creator" gorm:"foreignKey:CreatorID"`

	Title          string `json:"title"`
	WorkExperience string `json:"work_experience"`
	Achievements   string `json:"achievements"`

	CategoryID uint     `json:"category_id" gorm:"index"`
	Category   Category `json:"category" gorm:"foreignKey:CategoryID"`

	SubcategoryID *uint        `json:"subcategory_id" gorm:"index"`
	Subcategory   *Subcategory `json:"subcategory" gorm:"foreignKey:SubcategoryID"`

	KeyWords *[]Keyword `json:"keywords" gorm:"foreignKey:ResumeID"`

	Salary uint `json:"salary"`

	CityID *uint `json:"city_id" gorm:"index"`
	City   *City `json:"city" gorm:"foreignKey:CityID"`

	Experience float64 `json:"experience"`

	EmploymentID uint       `json:"employment_id" gorm:"index"`
	Employment   Employment `json:"employment" gorm:"foreignKey:EmploymentID"`

	Inactive bool `json:"inactive"`

	CreatedAt time.Time
	UpdatedAt time.Time
}

func (Resume) TableName() string {
	return "Resume"
}

type JobApplication struct {
	ID uint `json:"id" gorm:"unique;primaryKey;autoIncrement"`

	JobID uint `json:"job_id" gorm:"index"`
	Job   Job  `json:"job" gorm:"foreignKey:JobID"`

	RecruiterID uint `json:"recruiter_id" gorm:"index"`
	Recruiter   User `json:"recruiter" gorm:"foreignKey:RecruiterID"`

	CandidateID uint `json:"candidate_id" gorm:"index"`
	Candidate   User `json:"candidate" gorm:"foreignKey:CandidateID"`

	Status ApplicationStatus `json:"status" gorm:"default:'PENDING'"`

	CreatedAt time.Time
	UpdatedAt time.Time
}

func (JobApplication) TableName() string {
	return "JobApplication"
}

type ResumeApplication struct {
	ID uint `json:"id" gorm:"unique;primaryKey;autoIncrement"`

	ResumeID uint   `json:"resume_id" gorm:"index"`
	Resume   Resume `json:"resume" gorm:"foreignKey:ResumeID"`

	CandidateID uint `json:"candidate_id" gorm:"index"`
	Candidate   User `json:"candidate" gorm:"foreignKey:CandidateID"`

	RecruiterID uint `json:"recruiter_id" gorm:"index"`
	Recruiter   User `json:"recruiter" gorm:"foreignKey:RecruiterID"`

	Status ApplicationStatus `json:"status" gorm:"default:'PENDING'"`

	CreatedAt time.Time
	UpdatedAt time.Time
}

func (ResumeApplication) TableName() string {
	return "ResumeApplication"
}

type Category struct {
	ID uint `json:"id" gorm:"unique;primaryKey;autoIncrement"`

	Name          string        `json:"category_name"`
	Subcategories []Subcategory `json:"subcategories" gorm:"foreignKey:CategoryID"`
	KeyWords      []Keyword     `json:"keywords" gorm:"foreignKey:CategoryID"`

	CreatedAt time.Time
	UpdatedAt time.Time
}

func (Category) TableName() string {
	return "Category"
}

type Subcategory struct {
	ID uint `json:"id" gorm:"unique;primaryKey;autoIncrement"`

	Name       string `json:"subcategory_name"`
	CategoryID uint   `json:"category_id"`

	CreatedAt time.Time
	UpdatedAt time.Time
}

func (Subcategory) TableName() string {
	return "Subcategory"
}

type Keyword struct {
	ID uint `json:"id" gorm:"unique;primaryKey;autoIncrement"`

	Name       string   `json:"keyword_name"`
	CategoryID uint     `json:"category_id"`
	Category   Category `json:"category" gorm:"foreignKey:CategoryID"`

	JobID    uint `json:"job_id"`
	ResumeID uint `json:"resume_id"`

	CreatedAt time.Time
	UpdatedAt time.Time
}

func (Keyword) TableName() string {
	return "Keyword"
}

type City struct {
	ID uint `json:"id" gorm:"unique;primaryKey;autoIncrement"`

	Name string `json:"city"`

	CreatedAt time.Time
	UpdatedAt time.Time
}

func (City) TableName() string {
	return "City"
}

type Employment struct {
	ID   uint   `json:"id" gorm:"unique;primaryKey;autoIncrement"`
	Name string `json:"employment"`

	CreatedAt time.Time
	UpdatedAt time.Time
}

func (Employment) TableName() string {
	return "Employment"
}

type ApplicationStatus string

const (
	ApplicationStatusPending   ApplicationStatus = "PENDING"
	ApplicationStatusSucceeded ApplicationStatus = "SUCCEEDED"
	ApplicationStatusCanceled  ApplicationStatus = "CANCELED"
)

type Role string

const (
	CandidateRole Role = "CANDIDATE"
	RecruiterRole Role = "RECRUITER"
)
