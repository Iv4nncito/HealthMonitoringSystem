import React from 'react';

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

interface HealthMetricItemProps {
  metric: HealthMetric;
  onUpdate: (metric: HealthMetric) => void;
  onDelete: (id: string) => void;
}

const HealthMetricItem: React.FC<HealthMetricItemProps> = ({
  metric,
  onUpdate,
  onDelete,
}) => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleDelete = () => {
    onDelete(metric.id);
    console.log(`Deleting metric with id: ${metric.id} from API at: ${apiUrl}`);
  };

  const handleUpdate = () => {
    onUpdate(metric);
    console.log(`Updating metric with id: ${metric.id} at API: ${apiUrl}`);
  };

  return (
    <li>
      Type: {metric.type}, Value: {metric.value}, Date: {metric.date}
      <button onClick={handleUpdate}>Update</button>
      <button onClick={handleDelete}>Delete</button>
    </li>
  );
}

const HealthMetricsList: React.FC<HealthMetricsListProps> = ({
  metrics,
  onUpdate,
  onDelete,
}) => {
  return (
    <ul>
      {metrics.map((metric) => (
        <HealthMetricItem
          key={metric.id}
          metric={metric}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};

export default HealthThealMetricsList;