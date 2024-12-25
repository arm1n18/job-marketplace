package main

import (
	"backend/config"
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"

	_ "github.com/lib/pq"
)

type MoreJobsByCategory struct {
	Name  string `json:"name"`
	Count int    `json:"count"`
}

type HigherSalaryByCategory struct {
	Name      string  `json:"name"`
	AvgSalary float64 `json:"avgSalary"`
}

type Statistics struct {
	TotalJobs                 int     `json:"totalJobs"`
	AvgJobSalary              float64 `json:"avgJobSalary"`
	AvgJobExperience          float64 `json:"avgJobExperience"`
	TotalCandidates           int     `json:"totalCandidates"`
	AvgCandidateSalary        float64 `json:"avgCandidateSalary"`
	AvgCandidateExperience    float64 `json:"avgCandidateExperience"`
	TotalApplications         int     `json:"totalApplications"`
	TotalAcceptedApplications int     `json:"totalAcceptedApplications"`
	PercentageOfApplications  float64 `json:"percentageOfApplications"`

	MoreJobsByCategory []MoreJobsByCategory `json:"moreJobsByCategory"`

	HigherSalaryByCategory []HigherSalaryByCategory `json:"higherSalaryByCategory"`
}

type Difference struct {
	JobsDifference         int     `json:"jobsDifference"`
	CandidatesDifference   int     `json:"candidatesDifference"`
	ApplicationsDifference float64 `json:"applicationsDifference"`
}

type Report struct {
	Statistics Statistics `json:"statistics"`
	Difference Difference `json:"difference"`
}

func GetStats(db *sql.DB) Statistics {
	var stats Statistics

	query := `SELECT 
    (SELECT COUNT(DISTINCT id) FROM "Job") AS TotalJobs,
    (SELECT COUNT(DISTINCT creator_id) FROM "Resume") AS TotalCandidates,
    (SELECT COUNT(DISTINCT id) FROM "JobApplication") AS TotalApplications,
    (SELECT COUNT(DISTINCT id) FROM "JobApplication" WHERE status = 'SUCCEEDED') AS TotalAcceptedCandidates,
    AVG(COALESCE(r.salary, 0)) AS AvgCandidateSalary,
    AVG(COALESCE(r.experience, 0)) AS AvgCandidateExperience,
    AVG(COALESCE(j.experience, 0)) AS AvgJobExperience,
		CASE 
			WHEN COUNT(DISTINCT j.id) > 0 THEN AVG((j.salary_from + j.salary_to) / 2.0)
			ELSE 0
		END AS AvgJobSalary
	FROM "Resume" r
	LEFT JOIN "JobApplication" ja ON r.creator_id = ja.candidate_id
	LEFT JOIN "Job" j ON ja.job_id = j.ID
	`

	rows := db.QueryRow(query)
	err := rows.Scan(&stats.TotalJobs, &stats.TotalCandidates, &stats.TotalApplications,
		&stats.TotalAcceptedApplications, &stats.AvgCandidateSalary,
		&stats.AvgCandidateExperience, &stats.AvgJobExperience, &stats.AvgJobSalary)
	if err != nil {
		log.Printf("Помилка виконання запиту: %v\n", err)
	}

	return stats
}

func GetMoreJobsByCategory(db *sql.DB) []MoreJobsByCategory {
	var topCategories []MoreJobsByCategory

	query := `SELECT 
		c.Name AS CategoryName,
		COUNT(DISTINCT j.ID) AS Count
	FROM "Job" j
	LEFT JOIN "Category" c ON j.category_id = c.ID
	GROUP BY j.category_id, c.Name
	ORDER BY Count DESC
	LIMIT 3
	`

	rows, err := db.Query(query)
	if err != nil {
		log.Printf("Помилка виконання запиту: %v\n", err)
	}

	for rows.Next() {
		var category MoreJobsByCategory
		err := rows.Scan(&category.Name, &category.Count)
		if err != nil {
			log.Printf("Помилка виконання запиту: %v\n", err)
		}
		topCategories = append(topCategories, category)
	}

	if err := rows.Err(); err != nil {
		fmt.Printf("ошибка при обработке строк: %v", err)
	}

	return topCategories
}

func GetHigherSalaryByCategory(db *sql.DB) []HigherSalaryByCategory {
	var topCategories []HigherSalaryByCategory

	query := `SELECT 
		c.Name AS CategoryName,
		AVG((j.salary_from + j.salary_to) / 2.0) AS AvgSalary
	FROM "Job" j
	LEFT JOIN "Category" c ON j.category_id = c.ID
	GROUP BY j.category_id, c.Name
	ORDER BY AvgSalary DESC
	LIMIT 3
	`

	rows, err := db.Query(query)
	if err != nil {
		log.Printf("Помилка виконання запиту: %v\n", err)
	}

	for rows.Next() {
		var category HigherSalaryByCategory
		err := rows.Scan(&category.Name, &category.AvgSalary)
		if err != nil {
			log.Printf("Помилка виконання запиту: %v\n", err)
		}
		topCategories = append(topCategories, category)
	}

	if err := rows.Err(); err != nil {
		fmt.Printf("ошибка при обработке строк: %v", err)
	}

	return topCategories
}

func main() {
	cfg := config.LoadDataBaseConfig()

	dsn := "host=" + cfg.Host + " user=" + cfg.User + " password=" + cfg.Password + " dbname=" + cfg.DBName + " sslmode=require"

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		fmt.Print(err)
		return
	}

	defer db.Close()

	stats := GetStats(db)
	moreJobsByCategory := GetMoreJobsByCategory(db)
	higherSalaryByCategory := GetHigherSalaryByCategory(db)

	stats.MoreJobsByCategory = moreJobsByCategory
	stats.HigherSalaryByCategory = higherSalaryByCategory

	jsonData, err := json.Marshal(stats)
	if err != nil {
		fmt.Println(err)
		return
	}

	var report Report
	err = json.Unmarshal([]byte(jsonData), &report)
	if err != nil {
		fmt.Println(err)
		return
	}

	report.Difference.ApplicationsDifference = ((float64(stats.TotalAcceptedApplications) / float64(stats.TotalApplications)) - report.Statistics.PercentageOfApplications) * 100
	report.Difference.JobsDifference = stats.TotalJobs - report.Statistics.TotalJobs
	report.Difference.CandidatesDifference = stats.TotalCandidates - report.Statistics.TotalCandidates

	report.Statistics.TotalJobs = stats.TotalJobs
	report.Statistics.AvgJobSalary = stats.AvgJobSalary
	report.Statistics.AvgJobExperience = stats.AvgJobExperience
	report.Statistics.TotalCandidates = stats.TotalCandidates
	report.Statistics.AvgCandidateSalary = stats.AvgCandidateSalary
	report.Statistics.AvgCandidateExperience = stats.AvgCandidateExperience
	report.Statistics.TotalApplications = stats.TotalApplications
	report.Statistics.TotalAcceptedApplications = stats.TotalAcceptedApplications
	report.Statistics.PercentageOfApplications = (float64(stats.TotalAcceptedApplications) / float64(stats.TotalApplications)) * 100

	report.Statistics.MoreJobsByCategory = stats.MoreJobsByCategory

	report.Statistics.HigherSalaryByCategory = stats.HigherSalaryByCategory

	jsonData, err = json.MarshalIndent(report, "", "    ")
	if err != nil {
		log.Fatal(err)
	}

	err = ioutil.WriteFile("statistics.json", jsonData, 0644)
	if err != nil {
		fmt.Println(err)
		return
	}
}
