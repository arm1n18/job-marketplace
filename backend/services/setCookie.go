package services

import (
	"github.com/gin-gonic/gin"
)

// func SetCookie(c *gin.Context, refreshToken string) {
// 	c.SetCookie("refresh_token", refreshToken, 7*24*3600, "/", "192.168.0.106", false, true)
// }

func SetCookie(c *gin.Context, refreshToken string) {
	c.SetCookie("refresh_token", refreshToken, 7*24*3600, "/", "192.168.0.106", false, true)
}
