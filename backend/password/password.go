package main

import (
	"log"

	"golang.org/x/crypto/bcrypt"
)

func IsPasswordCorrect(hashedPassword string, password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	log.Printf("Compare: %s + %s", hashedPassword, password)
	return err == nil
}

func main() {
	err := bcrypt.CompareHashAndPassword([]byte("$2a$10$90mMPsXSf.rfh/K0tMatQOHQuGaLkytRCr1ddyTTQSAjWXDen.T0S"), []byte("denisbachinskiy2005@gmail.com"))
	if err == nil {
		log.Printf("Compare: %s + %s", "$2a$10$90mMPsXSf.rfh/K0tMatQOHQuGaLkytRCr1ddyTTQSAjWXDen.T0S", "denisbachinskiy2005@gmail.com")
	}
}
