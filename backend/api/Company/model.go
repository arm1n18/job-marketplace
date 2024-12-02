package company

type CompanyResponse struct {
}

type Company struct {
	ID          uint   `json:"id"`
	RecruiterID uint   `json:"recruiter_id"`
	CompanyName string `json:"company_name"`
	AboutUs     string `json:"about_us"`
	ImageUrl    string `json:"image_url"`
	WebSite     string `json:"website"`
	LinkedIn    string `json:"linkedin"`
	Facebook    string `json:"facebook"`
}
