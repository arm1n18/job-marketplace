package services

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func RecruiterMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		if userRole, _ := c.Get("userRole"); userRole != "RECRUITER" {
			c.Status(http.StatusForbidden)
			c.Abort()
		}

		c.Next()
	}
}
