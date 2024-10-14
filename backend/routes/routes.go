package routes

import (
	"backend/api"

	"github.com/gin-gonic/gin"
)

func InitRouter(r *gin.Engine) {
	r.GET("/jobs", api.GetJobs)
	r.GET("/jobs/:id", api.GetJob)
	//r.GET("/jobs/search", api.SearchJob)

	r.GET("/candidates", api.GetResumes)
	r.GET("/candidates/:id", api.GetResume)
	//r.GET("/candidates/search", api.SearchResume)

	r.GET("/company/:name", api.GetCompany)
}
