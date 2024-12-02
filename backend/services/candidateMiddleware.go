package services

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func CandidateMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		if userRole, _ := c.Get("userRole"); userRole != "CANDIDATE" {
			c.Status(http.StatusForbidden)
			c.Abort()
		}
		c.Next()
	}
}
