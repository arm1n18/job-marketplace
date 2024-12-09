package response

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

var status = map[string]string{
	"applyForJob":    "APPLICATION_PENDING",
	"acceptJob":      "SUCCEEDED",
	"rejectJob":      "REJECTED",
	"applyForResume": "OFFER_PENDING",
	"acceptResume":   "SUCCEEDED",
	"rejectResume":   "REJECTED",
}

func ApplyForJob(c *gin.Context, applyData *ApplyData, db *sql.DB, status string) {
	userRole, _ := c.Get("userRole")

	if userRole != "CANDIDATE" {
		c.JSON(http.StatusForbidden, gin.H{"error": userRole})
		return
	}

	query := `INSERT INTO "JobApplication" ("job_id", "recruiter_id", "candidate_id", "status", "created_at", "updated_at")
				VALUES ($1, $2, $3, $4, NOW(), NOW())`

	_, err := db.Exec(query, applyData.ApplyingForId, applyData.RecruiterID, applyData.CandidateID, status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		log.Print(err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Job applied successfully"})
}

func RespondJob(c *gin.Context, applyData *ApplyData, db *sql.DB, status string) {
	userRole, _ := c.Get("userRole")

	if userRole != "CANDIDATE" {
		c.JSON(http.StatusForbidden, gin.H{"error": userRole})
		return
	}

	query := `UPDATE "ResumeApplication"
		SET "status" = $3
		WHERE "job_id" = $1 AND "candidate_id" = $2`

	_, err := db.Exec(query, applyData.ApplyingForId, applyData.CandidateID, status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		log.Print(err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Job responded successfully"})
}

func ApplyForResume(c *gin.Context, applyData *ApplyData, db *sql.DB, status string) {
	userRole, _ := c.Get("userRole")

	if userRole != "RECRUITER" {
		c.JSON(http.StatusForbidden, gin.H{"error": userRole})
		return
	}

	query := `INSERT INTO "ResumeApplication" ("resume_id", "job_id", "candidate_id", "recruiter_id", "status", "created_at", "updated_at")
              VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`

	stmt, err := db.Prepare(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error preparing query"})
		log.Println("Error preparing query:", err)
		return
	}
	defer stmt.Close()

	_, err = stmt.Exec(applyData.ApplyingForId, applyData.JobID, applyData.RecruiterID, applyData.CandidateID, status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		log.Println("Error executing query:", err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Resume applied successfully"})
}

func RespondResume(c *gin.Context, applyData *ApplyData, db *sql.DB, status string) {
	userRole, _ := c.Get("userRole")

	if userRole != "RECRUITER" {
		c.JSON(http.StatusForbidden, gin.H{"error": userRole})
		return
	}

	fmt.Print(applyData.JobID, applyData.CandidateID, status)

	query := `UPDATE "JobApplication"
		SET "status" = $3
		WHERE "job_id" = $1 AND "candidate_id" = $2`

	_, err := db.Exec(query, applyData.JobID, applyData.CandidateID, status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		log.Print(err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Resume responded successfully"})
}

func (r *Response) Response(c *gin.Context, db *sql.DB) {
	var applyData ApplyData

	if err := c.ShouldBindJSON(&applyData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	methodsMap := map[string]func(*gin.Context, *ApplyData, *sql.DB, string){
		"applyForJob":    ApplyForJob,
		"acceptJob":      RespondJob,
		"rejectJob":      RespondJob,
		"applyForResume": ApplyForResume,
		"acceptResume":   RespondResume,
		"rejectResume":   RespondResume,
	}

	if handler, ok := methodsMap[applyData.Method]; ok {
		handler(c, &applyData, db, status[applyData.Method])
	}
}

func GetCandidateApplicationInfo(c *gin.Context, db *sql.DB) {
	var resp СandidateResumeRespond
	query := `
	SELECT
		u.email, j.Title, j.id,
		co.company_name AS CompanyName,
		co.image_url AS ImageUrl, co.phone_number AS PhoneNumber, co.recruiter_name AS RecruiterName
	FROM "Company" co
	LEFT JOIN "User" u ON co.recruiter_id = u.id
	LEFT JOIN "Job" j ON j.id = (SELECT job_id FROM "ResumeApplication" WHERE "id" = $1)
	WHERE co.recruiter_id = (SELECT recruiter_id FROM "ResumeApplication" WHERE "id" = $1)
	`

	rows := db.QueryRow(query, c.Param("id"))
	err := rows.Scan(&resp.Email, &resp.JobTitle, &resp.JobID, &resp.CompanyName, &resp.ImageUrl, &resp.Phone, &resp.RecruiterName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, resp)
}

func GetRecruiterApplicationInfo(c *gin.Context, db *sql.DB) {
	var resp RecruiterResumeRespond
	query := `
			SELECT 
			u.email, 
			r.Title AS resume_title, 
			r.id AS resume_id, 
			j.Title AS job_title, 
			j.id AS job_id
		FROM "ResumeApplication" ra
		JOIN "Resume" r ON r.id = ra.resume_id
		JOIN "User" u ON u.id = r.creator_id
		JOIN "Job" j ON j.id = ra.job_id
		WHERE ra.id = $1
	`

	rows := db.QueryRow(query, c.Param("id"))
	err := rows.Scan(&resp.Email, &resp.ResumeTitle, &resp.ResumeID, &resp.JobTitle, &resp.JobID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, resp)
}

func (r *Response) GetApplicationInfo(c *gin.Context, db *sql.DB) {
	userRole, _ := c.Get("userRole")

	if userRole == "CANDIDATE" {
		GetCandidateOfferInfo(c, db)
	} else if userRole == "RECRUITER" {
		GetRecruiterApplicationInfo(c, db)
	}
}

func GetCandidateOfferInfo(c *gin.Context, db *sql.DB) {
	var resp СandidateResumeRespond
	query := `
	SELECT
		u.email, j.Title, j.id,
		co.company_name AS CompanyName,
		co.image_url AS ImageUrl, co.phone_number AS PhoneNumber, co.recruiter_name AS RecruiterName
	FROM "Company" co
	LEFT JOIN "User" u ON co.recruiter_id = u.id
	LEFT JOIN "Job" j ON j.id = (SELECT job_id FROM "JobApplication" WHERE "id" = $1)
	WHERE co.recruiter_id = (SELECT recruiter_id FROM "JobApplication" WHERE "id" = $1)
	`

	rows := db.QueryRow(query, c.Param("id"))
	err := rows.Scan(&resp.Email, &resp.JobTitle, &resp.JobID, &resp.CompanyName, &resp.ImageUrl, &resp.Phone, &resp.RecruiterName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, resp)
}

func GetRecruiterOfferInfo(c *gin.Context, db *sql.DB) {
	var resp RecruiterResumeRespond
	query := `
			SELECT 
			u.email, 
			r.Title AS resume_title, 
			r.id AS resume_id, 
			j.Title AS job_title,
			j.id AS job_id
		FROM "JobApplication" ja
		JOIN "Resume" r ON r.creator_id = ja.candidate_id
		JOIN "User" u ON u.id = r.creator_id
		JOIN "Job" j ON j.id = ja.job_id
		WHERE ja.id = $1
	`

	rows := db.QueryRow(query, c.Param("id"))
	err := rows.Scan(&resp.Email, &resp.ResumeTitle, &resp.ResumeID, &resp.JobTitle, &resp.JobID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, resp)
}

func (r *Response) GetOfferInfo(c *gin.Context, db *sql.DB) {
	userRole, _ := c.Get("userRole")

	if userRole == "CANDIDATE" {
		GetCandidateApplicationInfo(c, db)
	} else if userRole == "RECRUITER" {
		GetRecruiterOfferInfo(c, db)
	}
}
