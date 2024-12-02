package response

type Response struct{}

type ApplyData struct {
	Method        string `json:"method"`
	ApplyingForId int    `json:"applyingForID"`
	RecruiterID   int    `json:"recruiterID"`
	CandidateID   int    `json:"candidateID"`
	JobID         int    `json:"jobID"`
}
