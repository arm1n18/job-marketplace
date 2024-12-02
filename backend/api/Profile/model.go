package profile

import company "backend/api/Company"

type Profile struct{}

type CompanyProfile struct {
	company.Company
	RecruiterName string `json:"name"`
	PhoneNumber   uint   `json:"phone"`
}

type RecruiterID struct {
	RecruiterID uint `json:"recruiter_id"`
}
