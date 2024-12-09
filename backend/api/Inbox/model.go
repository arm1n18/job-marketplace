package inbox

import (
	resume "backend/api/Resume"
)

type Inbox struct{}

type InboxData struct {
	Method        string `json:"method"`
	ApplyingForId int    `json:"applyingForId"`
	RecruiterID   int    `json:"recruiterId"`
	CandidateID   int    `json:"candidateId"`
}

type ResumeRespond struct {
	resume.Resume
	JobID         int    `json:"jobID"`
	JobTitle      string `json:"jobTitle"`
	OfferID       int    `json:"offerID"`
	ApplicationID int    `json:"applicationID"`
}
