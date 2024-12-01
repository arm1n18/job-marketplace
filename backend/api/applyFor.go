package api

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type ApplyData struct {
	Method        string `json:"method"`
	ApplyingForId int    `json:"applyingForID"`
	RecruiterID   int    `json:"recruiterID"`
	CandidateID   int    `json:"candidateID"`
	JobID         int    `json:"jobID"`
}

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

func Response(c *gin.Context, db *sql.DB) {
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
		// "rejectResume":   RespondResume,
		// "acceptResume":   RespondResume,
	}

	if handler, ok := methodsMap[applyData.Method]; ok {
		handler(c, &applyData, db, status[applyData.Method])
	}
}
