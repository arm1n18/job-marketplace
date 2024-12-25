package services

import (
	"net/http"

	"github.com/gofiber/fiber/v2"
)

func CandidateMiddleware() func(*fiber.Ctx) error {
	return func(c *fiber.Ctx) error {
		if userRole := c.Locals("userRole"); userRole != "CANDIDATE" {
			return c.Status(http.StatusForbidden).JSON(fiber.Map{
				"error": "Wrong role",
			})
		}
		return c.Next()
	}
}
