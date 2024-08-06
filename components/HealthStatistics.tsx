import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';

interface HealthMetric {
  date: string;
  value: number;
}

const HealthStatistics: React.FC = () => {
  const [healthData, setHealthData] = useState<HealthMetric[]>([]);

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/health-metrics`);
        setHealthData(response.data);
      } catch (error) {
        console.error("Error fetching health data", error);
      }
    };

    fetchHealthData();
  }, []);

  const calculateAverageMetricValue = (metrics: HealthMetric[]) => {
    const totalValue = metrics.reduce((acc, currentMetric) => acc + currentMetric.value, 0);
    return (totalValue / metrics.length) || 0;
  };

  return (
    <div>
      <h2>Average Health Metric: {calculateAverageMetricValue(healthData).toFixed(2)}</h2>
      
      <LineChart
        width={500}
        height={300}
        data={healthData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </div>
  );
};

export default HealthStatistics;