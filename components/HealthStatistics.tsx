import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';

interface HealthMetric {
  date: string;
  value: number;
}

const HealthStats: React.FC = () => {
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);

  useEffect(() => {
    const fetchHealthMetrics = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/health-metrics`);
        setHealthMetrics(response.data);
      } catch (error) {
        console.error("Error fetching health metrics", error);
      }
    };

    fetchHealthMetrics();
  }, []);

  const calculateAverage = (metrics: HealthMetric[]) => {
    const sum = metrics.reduce((acc, curr) => acc + curr.value, 0);
    return (sum / metrics.length) || 0;
  };

  return (
    <div>
      <h2>Average Health Metric: {calculateAverage(healthMetrics).toFixed(2)}</h2>
      
      <LineChart
        width={500}
        height={300}
        data={healthMetrics}
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

export default HealthStats;