package main

import (
	"log"
	"smtp/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://127.0.0.1:8080",
		AllowMethods: "POST",
	}))

	app.Use(func(c *fiber.Ctx) error {
		log.Printf("Request: %s %s", c.Method(), c.Path())
		return c.Next()
	})

	routes.InitRouter(app)

	if err := app.Listen(":8081"); err != nil {
		panic(err)
	}
}
