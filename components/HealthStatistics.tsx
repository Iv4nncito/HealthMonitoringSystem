import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';

interface HealthMetric {
  date: string;
  value: number;
}

const HealthStatistics: React.FC = () => {
  const [fetchedHealthMetrics, setFetchedHealthMetrics] = useState<HealthMetric[]>([]);

  useEffect(() => {
    const retrieveHealthMetrics = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/health-metrics`);
        setFetchedHealthMetrics(response.data);
      } catch (error) {
        console.error("Error retrieving health metrics", error);
      }
    };

    retrieveHealthMetrics();
  }, []);

  const calculateAverageHealthMetric = (metrics: HealthMetric[]) => {
    const totalHealthValue = metrics.reduce((sum, currentMetric) => sum + currentMetric.value, 0);
    return (totalHealthValue / metrics.length) || 0;
  };

  return (
    <div>
      <h2>Average Health Metric: {calculateAverageHealthMetric(fetchedHealthMetrics).toFixed(2)}</h2>
      
      <LineChart
        width={500}
        height={300}
        data={fetchedHealthMetrics}
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