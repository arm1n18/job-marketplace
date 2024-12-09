package response

type Response struct{}

type ApplyData struct {
	Method        string `json:"method"`
	ApplyingForId int    `json:"applyingForID"`
	RecruiterID   int    `json:"recruiterID"`
	CandidateID   int    `json:"candidateID"`
	JobID         int    `json:"jobID"`
}

type СandidateResumeRespond struct {
	JobID         *int    `json:"jobID"`
	Email         string  `json:"email"`
	JobTitle      *string `json:"jobTitle"`
	ImageUrl      *string `json:"imageUrl"`
	Phone         *string `json:"phone"`
	RecruiterName *string `json:"recruiter_name"`
	CompanyName   *string `json:"company_name"`
}

type RecruiterResumeRespond struct {
	Email       string  `json:"email"`
	ResumeTitle *string `json:"resumeTitle"`
	ResumeID    *int    `json:"resumeID"`
	JobTitle    *string `json:"jobTitle"`
	JobID       *int    `json:"jobID"`
}
