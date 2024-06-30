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
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}

func CalculateAverage(metrics []HealthMetric) float64 {
	metricsCount := len(metrics)
	if metricsCount == 0 {
		return 0
	}

	sum := 0.0
	for _, metric := range metrics {
		sum += metric.Value
	}

	return sum / float64(metricsCount)
}

func CalculateTrend(metrics []HealthMetric) float64 {
	metricsCount := len(metrics)
	if metricsCount < 2 {
		return 0
	}

	positiveTrendCount, negativeTrendCount := 0, 0

	for i := 1; i < metricsCount; i++ {
		delta := metrics[i].Value - metrics[i-1].Value
		switch {
		case delta > 0:
			positiveTrendCount++
		case delta < 0:
			negativeTrendCount++
		}
	}

	switch {
	case positiveTrendCount > negativeTrendCount:
		return 1
	case negativeTrendCount > positiveTrendCount:
		return -1
	default:
		return 0
	}
}

func CalculateVariability(metrics []HealthMetric) float64 {
	metricsCount := len(metrics)
	if metricsCount < 2 {
		return 0
	}

	average := CalculateAverage(metrics)
	
	sumSquareDiff := 0.0
	for _, metric := range metrics {
		diff := metric.Value - average
		sumSquareDiff += diff * diff
	}

	variance := sumSquareDiff / float64(metricsCount-1)
	return math.Sqrt(variance)
}

func RetrieveMetrics(source string) ([]HealthMetric, error) {
	now := time.Now()
	return []HealthMetric{
		{Time: now.Add(-24 * time.Hour), Value: 72},
		{Time: now.Add(-18 * time.Hour), Value: 75},
		{Time: now.Add(-12 * time.Hour), Value: 73},
		{Time: now.Add(-6 * time.Hour), Value: 76},
		{Time: now, Value: 74},
	}, nil
}

func ExampleUsage() {
	metricSource := LoadEnvVar("METRIC_SOURCE", "defaultSource")

	metrics, err := RetrieveMetrics(metricMonster)
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