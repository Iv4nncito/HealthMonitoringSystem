package healthmetrics

import (
	"fmt"
	"math"
	"os"
	"time"
)

type HealthMetric struct {
	Time  time.Time
	Value float64
}

func LoadEnvVar(key, defaultValue string) string {
	value, exists := os.LookupEnv(key)
	if !exists {
		return defaultValue
	}
	return value
}

func CalculateAverage(metrics []HealthMetric) float64 {
	if len(metrics) == 0 {
		return 0
	}

	sum := 0.0
	for _, metric := range metrics {
		sum += metric.Value
	}

	return sum / float64(len(metrics))
}

func CalculateTrend(metrics []HealthMetric) float64 {
	if len(metrics) < 2 {
		return 0
	}

	positiveTrendCount := 0
	negativeTrendCount := 0

	for i := 1; i < len(metrics); i++ {
		if metrics[i].Value > metrics[i-1].Value {
			positiveTrendCount++
		} else if metrics[i].Value < metrics[i-1].Value {
			negativeTrendCount++
		}
	}

	if positiveTrendCount == negativeTrendCount {
		return 0
	} else if positiveTrendCount > negativeTrendCount {
		return 1
	} else {
		return -1
	}
}

func CalculateVariability(metrics []HealthMetric) float64 {
	average := CalculateAverage(metrics)
	if len(metrics) < 2 {
		return 0
	}

	var sum float64
	for _, metric := range metrics {
		sum += (metric.Value - average) * (metric.Value - average)
	}

	variance := sum / float64(len(metrics)-1) 
	return math.Sqrt(variance)
}

func RetrieveMetrics(source string) ([]HealthMetric, error) {
	return []HealthMetric{
		{Time: time.Now().Add(-24 * time.Hour), Value: 72},
		{Time: time.Now().Add(-18 * time.Hour), Value: 75},
		{Time: time.Now().Add(-12 * time.Hour), Value: 73},
		{Time: time.Now().Add(-6 * time.Hour), Value: 76},
		{Time: time.Now(), Value: 74},
	}, nil
}

func ExampleUsage() {
	metricSource := LoadEnvVar("METRIC_SOURCE", "defaultSource")

	metrics, err := RetrieveMetrics(metricSource)
	if err != nil {
		fmt.Printf("Error retrieving metrics: %v\n", err)
		return
    }
	
	average := CalculateAverage(metrics)
	trend := CalculateTrend(metrics)
	variability := CalculateVariability(metrics) 

	fmt.Printf("Average value: %.2f\n", average)
	fmt.Printf("Trend: %.0f\n", trend)
	fmt.Printf("Variability (Std. Deviation): %.2f\n", variability)
}