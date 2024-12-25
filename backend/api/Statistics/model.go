package statistics

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

type MoreJobsByCategory struct {
	Name  string `json:"name"`
	Count int    `json:"count"`
}

type HigherSalaryByCategory struct {
	Name      string  `json:"name"`
	AvgSalary float64 `json:"avgSalary"`
}
