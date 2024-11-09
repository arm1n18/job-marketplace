package services

import (
	"backend/database"
)

func IsCorrectRole(role database.Role) bool {
	return role == database.CandidateRole || role == database.RecruiterRole
}
