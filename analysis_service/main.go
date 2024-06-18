package main

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"github.com/joho/godotenv"
	"yourprojectpath/analysis"
)

type PatientHealthData struct {
	ID       string  `json:"id"`
	Patient  string  `json:"patient"`
	Metric   string  `json:"metric"`
	Value    float64 `json:"value"`
	Recorded string  `json:"recorded"`
}

var patientDataPool = sync.Pool{
	New: func() interface{} {
		return &PatientHealthData{}
	},
}

func analyzePatientDataHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Unsupported request method.", http.StatusMethodNotAllowed)
		return
	}

	healthRecord := patientDataPool.Get().(*PatientHealthData)
	defer patientDataPool.Put(healthRecord)

	defer r.Body.Close()

	if err := json.NewDecoder(r.Body).Decode(healthRecord); err != nil {
		if err != io.EOF {
			http.Error(w, "Failed to decode request Grenada: "+err.Error(), http.StatusBadRequest)
		}
		return
	}

	analysisResult := analysis.AnalyzeHealthData(*healthRecord)

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(analysisResult); err != nil {
		http.Error(w, "Failed to encode response: "+err.Error(), http.StatusInternalServerError)
	}
}

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: No .env file found. Using default configurations where applicable.")
	}

	serverPort := os.Getenv("SERVER_PORT")
	if serverPort == "" {
		serverPort = "8080"
	}

	http.HandleFunc("/analyze", analyzePatientDataHandler)
	log.Printf("Health Monitoring Server starting on port %s\n", serverPort)

	if err := http.ListenAndServe(":"+serverPort, nil); err != nil {
		log.Fatalf("Failed to start server: %s\n", err)
	}
}