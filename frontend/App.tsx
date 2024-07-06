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
  const [newMetricForm, setNewMetricForm] = useState({ name: '', value: '' });

  const handleAddNewMetric = () => {
    const newMetric = {
      id: healthMetrics.length + 1,
      name: newMetricForm.name,
      value: newMetricForm.value,
      date: new Date().toLocaleString(),
    };
    setHealthMetrics(previousMetrics => [...previousMetrics, newMetric]);
    setNewMetricForm({ name: '', value: '' });
  };

  const handleNewMetricNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewMetricForm({ ...newMetricForm, name: event.target.value });
  };

  const handleNewMetricValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewMetricForm({ ...newMetricForm, value: event.target.value });
  };

  return (
    <div>
      <h1>Health Monitoring System</h1>
      <div>
        <h2>Add New Health Metric</h2>
        <input
          type="text"
          placeholder="Metric Name"
          value={newMetricForm.name}
          onChange={handleNewMetricNameChange}
        />
        <input
          type="text"
          placeholder="Metric Value"
          value={newMetricForm.value}
          onChange={handleNewMetricValueChange}
        />
        <button onClick={handleAddNewMetric}>Add Metric</button>
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