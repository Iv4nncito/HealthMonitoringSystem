package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"github.com/joho/godotenv"
	"yourprojectpath/analysis"
)

type HealthData struct {
	ID       string  `json:"id"`
	Patient  string  `json:"patient"`
	Metric   string  `json:"metric"`
	Value    float64 `json:"value"`
	Recorded string  `json:"recorded"`
}

func healthDataAnalysisHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method is not supported.", http.StatusNotFound)
		return
	}

	var data HealthData
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	result := analysis.PerformAnalysis(data)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	port := os.Getenv("SERVER_PORT")
	if port == "" {
		port = "8080"
	}

	http.HandleFunc("/analyze", healthDataAnalysisHandler)
	log.Printf("Server starting on port %s\n", port)

	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatalf("Error starting server: %s\n", err)
	}
}