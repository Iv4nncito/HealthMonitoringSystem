import React, { useState } from 'react';

const initialMetrics = [
  { id: 1, name: 'Heart Rate', value: '72 bpm', date: new Date().toLocaleString() },
  { id: 2, name: 'Blood Pressure', value: '120/80 mmHg', date: new Date().toLocaleString() }
];

interface Metric {
  id: number;
  name: string;
  value: string;
  date: string;
}

const HealthMonitoringApp: React.FC = () => {
  const [metrics, setMetrics] = useState<Metric[]>(initialMetrics);
  const [newMetric, setNewMetric] = useState({ name: '', value: '' });

  const addMetric = () => {
    setMetrics([
      ...metrics,
      {
        id: metrics.length + 1,
        name: newMetric.name,
        value: newMetric.value,
        date: new Date().toLocaleString(),
      },
    ]);
    setNewMetric({ name: '', value: '' });
  };

  return (
    <div>
      <h1>Health Monitoring System</h1>
      <div>
        <h2>Add New Metric</h2>
        <input
          type="text"
          placeholder="Metric name"
          value={newMetric.name}
          onChange={(e) => setNewMetric({ ...newMetric, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Metric value"
          value={newMetric.value}
          onChange={(e) => setNewMetric({ ...newMetric, value: e.target.value })}
        />
        <button onClick={addMetric}>Add Metric</button>
      </div>
      <div>
        <h2>Metrics List</h2>
        <ul>
          {metrics.map(metric => (
            <li key={metric.id}>{`${metric.name}: ${metric.value} (Recorded on: ${metric.date})`}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HealthMonitoringApp;