package services

import (
	"time"

	"github.com/gofiber/fiber/v2"
)

func SetCookie(c *fiber.Ctx, refreshToken string) {
	cookie := new(fiber.Cookie)
	cookie.Name = "refresh_token"
	cookie.Value = refreshToken
	cookie.Expires = time.Now().Add(time.Hour * 24 * 7)
	cookie.Path = "/"
	cookie.Domain = "192.168.0.106"
	cookie.HTTPOnly = true
	cookie.Secure = false // Only HTTPS
	c.Cookie(cookie)
}
