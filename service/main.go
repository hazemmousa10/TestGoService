package main

import (
	"fmt"
	"log"
	"net/http"
)

// helloHandler handles requests to the /hello endpoint
func helloHandler(w http.ResponseWriter, r *http.Request) {
	// Check if the request method is GET
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Respond with a simple greeting
	fmt.Fprintln(w, "Hello from your Go API!")
}

func main() {
	// Register the handler function for the /hello endpoint
	http.HandleFunc("/hello", helloHandler)

	// Start the HTTP server on port 8080
	fmt.Println("Server starting on port 8080...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
