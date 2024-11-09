package routes

import (
	"backend/api"
	"backend/services"
	"database/sql"

	"github.com/gin-gonic/gin"
)

func InitRouter(r *gin.Engine, db *sql.DB) {
	r.GET("/jobs", services.AuthMiddleware(db), api.GetJobs)
	r.GET("/jobs/:id", services.AuthMiddleware(db), api.GetJob)
	r.POST("/jobs/create", services.AuthMiddleware(db), api.CreateJob)

	r.GET("/candidates", services.AuthMiddleware(db), api.GetResumes)
	r.GET("/candidates/:id", services.AuthMiddleware(db), api.GetResume)
	r.POST("/candidates/create", services.AuthMiddleware(db), services.CheckExistResume(db), api.CreateResume)

	r.GET("/company/:name", services.AuthMiddleware(db), api.GetCompany)
	r.POST("/company/create", services.AuthMiddleware(db), services.CheckExistCompany(db), api.CreateCompany)

	// r.POST("/upload/photo", services.AuthMiddleware(db), api.UploadPhoto)

	r.POST("/auth/register", api.Register)
	r.POST("/auth/login", api.Login)
	r.POST("/auth/logout", api.LogOut)
	r.GET("/auth/refresh-token", api.Refresh)

	r.GET("/profile/avatar", services.AuthMiddleware(db), api.GetAvatar)
}
