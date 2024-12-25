package routes

import (
	"smtp/api"

	"github.com/gofiber/fiber/v2"
)

func InitRouter(app *fiber.App) {
	app.Post("/send", func(c *fiber.Ctx) error { return api.SendEmail(c) })
}
