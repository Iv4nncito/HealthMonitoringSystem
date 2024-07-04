import React, { useState } from 'react';

const initialHealthMetrics = [
  { id: 1, name: 'Heart Rate', value: '72 bpm', date: new Date().toLocaleString() },
  { id: 2, name: 'Blood Pressure', value: '120/80 mmHg', date: new Date().toLocaleString() }
];

interface HealthMetric {
  id: number;
  name: string;
  value: string;
  date: string;
}

const HealthMonitoringApp: React.FC = () => {
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>(initialHealthMetrics);
  const [newHealthMetric, setNewHealthMetric] = useState({ name: '', value: '' });

  const handleAddMetric = () => {
    setHealthMetrics(prevMetrics => [
      ...prevMetrics,
      {
        id: prevMetrics.length + 1,
        name: newHealthMetric.name,
        value: newHealthMetric.value,
        date: new Date().toLocaleString(),
      },
    ]);
    setNewHealthMetric({ name: '', value: '' });
  };

  const handleMetricNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewHealthMetric({ ...newHealthMetric, name: event.target.value });
  };

  const handleMetricValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewHealthMetric({ ...newHealthMetric, value: event.target.value });
  };

  return (
    <div>
      <h1>Health Monitoring System</h1>
      <div>
        <h2>Add New Health Metric</h2>
        <input
          type="text"
          placeholder="Metric name"
          value={newHealthMetric.name}
          onChange={handleMetricNameChange}
        />
        <input
          type="text"
          placeholder="Metric value"
          value={newHealthMetric.value}
          onChange={handleMetricValueChange}
        />
        <button onClick={handleAddMetric}>Add Metric</button>
      </div>
      <div>
        <h2>Health Metrics List</h2>
        <ul>
          {healthMetrics.map(metric => (
            <li key={metric.id}>{`${metric.name}: ${metric.value} (Recorded on: ${metric.date})`}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HealthMonitoringApp;