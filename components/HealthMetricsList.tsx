import React, { useState } from 'react';

type HealthMetric = {
  id: string;
  type: string;
  value: string;
  date: string;
};

interface HealthMetricsListProps {
  metrics: HealthMetric[];
  onUpdate: (metric: HealthMetric) => void;
  onDelete: (id: string) => void;
}

const HealthMetricsList: React.FC<HealthMetricsListProps> = ({ metrics, onUpdate, onDelete }) => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleDelete = (id: string) => {
    onDelete(id);
    console.log(`Deleting metric with id: ${id} from API at: ${apiUrl}`);
  };

  const handleUpdate = (metric: HealthMetric) => {
    onUpdate(metric);
    console.log(`Updating metric with id: ${metric.id} at API: ${apiUrl}`);
  };

  return (
    <ul>
      {metrics.map(metric => (
        <li key={metric.id}>
          Type: {metric.type}, Value: {metric.value}, Date: {metric.date}
          <button onClick={() => handleUpdate(metric)}>Update</button>
          <button onClick={() => handleDelete(metric.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default HealthMetricsList;