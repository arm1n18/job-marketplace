package routes

import (
	"backend/api"
	"backend/services"
	"database/sql"

	"github.com/gin-gonic/gin"
)

func InitRouter(r *gin.Engine, db *sql.DB) {
	jobsGroup := r.Group("/jobs", services.AuthMiddleware(db))
	{
		jobsGroup.GET("/", func(c *gin.Context) { api.GetJobs(c, db) })
		jobsGroup.GET("/:id", func(c *gin.Context) { api.GetJob(c, db) })
		jobsGroup.POST("/", services.RecruiterMiddleware(), api.CreateJob)
	}

	candidatesGroup := r.Group("/candidates", services.AuthMiddleware(db))
	{
		candidatesGroup.GET("/", func(c *gin.Context) { api.GetResumes(c, db) })
		candidatesGroup.GET("/:id", api.GetResume)
		candidatesGroup.POST("/", services.CheckExistResume(db), api.CreateResume)
	}

	companyGroup := r.Group("/company", services.AuthMiddleware(db))
	{
		companyGroup.GET("/:name", func(c *gin.Context) { api.GetCompany(c, db) })
		companyGroup.GET("/jobs", func(c *gin.Context) { api.GetCompanyJobs(c, db) })
		companyGroup.POST("/", services.RecruiterMiddleware(), services.CheckExistCompany(db), api.CreateCompany)
	}

	authGroup := r.Group("/auth")
	{
		authGroup.POST("/register", api.Register)
		authGroup.POST("/login", api.Login)
		authGroup.POST("/logout", api.LogOut)
		authGroup.GET("/refresh-token", api.Refresh)
	}

	r.POST("/response", services.AuthMiddleware(db), func(c *gin.Context) { api.Response(c, db) })

	inboxGroup := r.Group("/inbox", services.AuthMiddleware(db))
	{
		inboxGroup.GET("/", func(c *gin.Context) { api.GetInbox(c, db) })
	}

	r.GET("/user/avatar", services.AuthMiddleware(db), api.GetAvatar)
	r.GET("/user/profile", services.AuthMiddleware(db), func(c *gin.Context) {
		api.GetUserProfile(c, db)
	})
}
