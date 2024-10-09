package routes

import (
	"backend/api"

	"github.com/gin-gonic/gin"
)

func InitRouter(r *gin.Engine) {
	r.GET("/jobs", api.GetJobs)
	r.GET("/jobs/:id", api.GetJob)
	r.GET("/company/:name", api.GetCompany)
	r.GET("/candidates", api.GetResumes)
}
