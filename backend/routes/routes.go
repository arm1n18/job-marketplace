package routes

import (
	auth "backend/api/Auth"
	company "backend/api/Company"
	inbox "backend/api/Inbox"
	job "backend/api/Job"
	profile "backend/api/Profile"
	response "backend/api/Response"
	resume "backend/api/Resume"
	"backend/services"
	"database/sql"

	"github.com/gin-gonic/gin"
)

func InitRouter(r *gin.Engine, db *sql.DB) {
	jobHandler := job.Job{}
	resumeHandler := resume.ResumeStruct{}
	companyHandler := company.CompanyResponse{}
	authHandler := auth.Auth{}
	profileHandler := profile.Profile{}
	inboxHandler := inbox.Inbox{}
	responseHandler := response.Response{}

	jobsGroup := r.Group("/jobs", services.AuthMiddleware(db))
	{
		jobsGroup.GET("/", func(c *gin.Context) { jobHandler.GetJobs(c, db) })
		jobsGroup.GET("/:id", func(c *gin.Context) { jobHandler.GetJobByID(c, db) })
		jobsGroup.POST("/", services.RecruiterMiddleware(), func(c *gin.Context) { jobHandler.CreateJob(c, db) })
	}

	candidatesGroup := r.Group("/candidates", services.AuthMiddleware(db))
	{
		candidatesGroup.GET("/", func(c *gin.Context) { resumeHandler.GetResumes(c, db) })
		candidatesGroup.GET("/:id", func(c *gin.Context) { resumeHandler.GetResumeByID(c, db) })
		candidatesGroup.POST("/", services.CheckExistResume(db), func(c *gin.Context) { resumeHandler.CreateResume(c, db) })
	}

	companyGroup := r.Group("/company", services.AuthMiddleware(db))
	{
		companyGroup.GET("/:name", func(c *gin.Context) { companyHandler.GetCompanyInfo(c, db) })
		companyGroup.GET("/jobs", func(c *gin.Context) { companyHandler.GetCompanyJobsList(c, db) })
		companyGroup.POST("/", services.RecruiterMiddleware(), services.CheckExistCompany(db), func(c *gin.Context) { companyHandler.CreateCompany(c, db) })
	}

	authGroup := r.Group("/auth")
	{
		authGroup.POST("/register", authHandler.Register)
		authGroup.POST("/login", authHandler.Login)
		authGroup.POST("/logout", authHandler.LogOut)
		authGroup.GET("/refresh-token", authHandler.RefreshToken)
	}

	r.POST("/response", services.AuthMiddleware(db), func(c *gin.Context) { responseHandler.Response(c, db) })

	inboxGroup := r.Group("/inbox", services.AuthMiddleware(db))
	{
		inboxGroup.GET("/", func(c *gin.Context) { inboxHandler.GetInbox(c, db) })
	}

	r.GET("/user/avatar", services.AuthMiddleware(db), profileHandler.GetAvatar)
	r.GET("/user/profile", services.AuthMiddleware(db), func(c *gin.Context) { profileHandler.GetUserProfile(c, db) })
}
