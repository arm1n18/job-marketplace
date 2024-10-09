package api

import (
	"backend/config"
	"database/sql"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

type Resume struct {
	ID             uint    `json:"id"`
	CreatorID      uint    `json:"creator_id"`
	Title          string  `json:"title"`
	WorkExperience string  `json:"work_experience"`
	Achievements   *string `json:"achievements"`

	CategoryName    string  `json:"category_name"`
	SubcategoryName *string `json:"subcategory_name"`

	CityName *string `json:"city_name"`

	Experience uint `json:"experience"`

	EmploymentName string `json:"employment_name"`

	Salary    *uint     `json:"salary"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func GetResumes(c *gin.Context) {
	var resumes []Resume

	cfg := config.LoadDataBaseConfig()

	dsn := "host=" + cfg.Host + " user=" + cfg.User + " password=" + cfg.Password + " dbname=" + cfg.DBName + " sslmode=require"

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Println("Ошибка подключения к Vercel:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка запроса к базе данных"})
		return
	}
	defer db.Close()

	rows, err := db.Query(`
	SELECT r.ID, r.creator_id, r.Title, r.work_experience AS WorkExperience, r.Achievements,
	       c.Name AS CategoryName,
	       s.Name AS SubcategoryName,
	       ct.Name AS CityName,
	       r.Experience, e.Name AS EmploymentName,
	       r.salary, r.created_at, r.updated_at
	FROM "Resume" r
	LEFT JOIN "Category" c ON r.category_id = c.ID
	LEFT JOIN "Subcategory" s ON r.subcategory_id = s.ID
	LEFT JOIN "City" ct ON r.city_id = ct.ID
	LEFT JOIN "Employment" e ON r.employment_id = e.ID
	LEFT JOIN "User" u ON r.creator_id = u.ID
	`)

	if err != nil {
		log.Printf("Ошибка выполнения запроса: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка запроса к базе данных"})
		return
	}
	defer rows.Close()

	for rows.Next() {
		resume := Resume{}
		err := rows.Scan(&resume.ID, &resume.CreatorID, &resume.Title, &resume.WorkExperience,
			&resume.Achievements, &resume.CategoryName, &resume.SubcategoryName, &resume.CityName,
			&resume.Experience, &resume.EmploymentName, &resume.Salary, &resume.CreatedAt, &resume.UpdatedAt)
		if err != nil {
			log.Printf("Error scanning row: %v, Data: %+v\n", err, resume)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error scanning jobs"})
			return
		}
		resumes = append(resumes, resume)
	}

	c.JSON(http.StatusOK, resumes)
}
