package auth

import (
	"backend/database"
)

type Auth struct{}

type UserLogin struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type UserRegister struct {
	UserLogin
	Role database.Role `json:"role" binding:"required"`
}
