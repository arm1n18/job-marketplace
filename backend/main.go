package main

import (
	//"net/http"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Ошибка загрузки .env файла")
	}

	router := gin.Default()

	port := os.Getenv("PORT")

	if err := router.Run(":" + port); err != nil {
		panic(err)
	}
}
