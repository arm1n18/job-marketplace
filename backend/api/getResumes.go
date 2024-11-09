package api

import (
	"backend/config"
	"database/sql"
	"log"
	"net/http"
	"strconv"
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

	Experience float64 `json:"experience"`

	EmploymentName string `json:"employment_name"`

	Salary    *uint     `json:"salary"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func GetResumes(c *gin.Context) {
	search := c.Query("search")
	category := c.Query("category")
	subcategory := c.Query("subcategory")
	experience := c.Query("experience")
	employment := c.Query("employment")
	city := c.Query("city")
	salary := c.Query("salary")

	var resumes []Resume

	cfg := config.LoadDataBaseConfig()

	dsn := "host=" + cfg.Host + " user=" + cfg.User + " password=" + cfg.Password + " dbname=" + cfg.DBName + " sslmode=require"

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Println("Помилка підключення до бази даних:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Помилка запиту до бази даних"})
		return
	}
	defer db.Close()

	query := (`
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
	WHERE TRUE
	`)

	var queryParams []interface{}

	argID := 1

	if search != "" {
		query += `AND (r.title ILIKE '%' || $` + strconv.Itoa(argID) + ` || '%'
		OR c.Name ILIKE '%' || $` + strconv.Itoa(argID) + ` || '%'
		OR s.Name ILIKE '%' || $` + strconv.Itoa(argID) + ` || '%')`
		queryParams = append(queryParams, search)
		argID++
	}

	if category != "" {
		query += ` AND c.Name = $` + strconv.Itoa(argID)
		queryParams = append(queryParams, category)
		argID++
	}

	if subcategory != "" {
		query += ` AND s.Name = $` + strconv.Itoa(argID)
		queryParams = append(queryParams, subcategory)
		argID++
	}

	if experience != "" {
		query += ` AND r.Experience = $` + strconv.Itoa(argID)
		queryParams = append(queryParams, experience)
		argID++
	}

	if employment != "" {
		query += ` AND e.Name = $` + strconv.Itoa(argID)
		queryParams = append(queryParams, employment)
		argID++
	}

	if city != "" {
		query += ` AND ct.Name = $` + strconv.Itoa(argID)
		queryParams = append(queryParams, city)
		argID++
	}

	if salary != "" {
		query += ` AND r.salary = $` + strconv.Itoa(argID)
		queryParams = append(queryParams, salary)
		argID++
	}

	query += ` ORDER BY r.ID DESC
	LIMIT 15`

	rows, err := db.Query(query, queryParams...)
	if err != nil {
		log.Printf("Ошибка выполнения запроса: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Помилка запиту до бази даних"})
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
