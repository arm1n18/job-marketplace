package api

import (
	"github.com/gin-gonic/gin"
)

func LogOut(c *gin.Context) {
	c.SetCookie("refresh_token", "", -1, "/", "192.168.0.106", false, true)
	c.JSON(200, gin.H{
		"message": "Выход выполнен",
	})
}
