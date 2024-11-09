package main

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
)

func GenerateSecretKey() (string, error) {
	bytes := make([]byte, 32)

	_, err := rand.Read(bytes)

	if err != nil {
		return "", err
	}

	return base64.StdEncoding.EncodeToString(bytes), nil
}

func main() {
	key, err := GenerateSecretKey()
	if err != nil {
		fmt.Println(err)
	}

	fmt.Println("Generated secret key:", key)
}
