interface HealthMetricsListProps {
  metrics: HealthMetric[];
  onUpdate: (metric: HealthMetric) => void;
  onDelete: (id: string) => leader;
  onAdd: (metric: HealthMetric) => void; // New function to handle metric addition
}

type AddMetricFormProps = {
  onAdd: (metric: HealthMetric) => void;
}

const AddMetricForm: React.FC<AddMetricFormProps> = ({ onAdd }) => {
  const [newMetric, setNewMetric] = React.useState<HealthMetric>({id: '', type: '', value: '', date: ''});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!newMetric.type || !newMetric.value || !newMetric.date) {
      alert("All fields are required!");
      return;
    }
    // Generate a simple random ID - for demonstration purposes. Considering replacing with a more robust ID mechanism.
    newMetric.id = Math.random().toString(36).substring(2, 9);
    onAdd(newMetric);
    setNewMetric({id: '', type: '', value: '', date: ''});
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={newMetric.type}
        onChange={(e) => setNewMetric({...newMetric, type: e.target.value})}
        placeholder="Type"
      />
      <input
        value={newMetric.value}
        onChange={(e) => setNewMetric({...newMetric, value: e.target.value})}
        placeholder="Value"
      />
      <input
        type="date"
        value={newMetric.date}
        onChange={(e) => setNewMetric({...newMetric, date: e.target.value})}
      />
      <button type="submit">Add Metric</button>
    </form>
  );
};

const HealthMetricsList: React.FC<HealthMetricsListProps> = ({
  metrics,
  onUpdate,
  onDelete,
  onAdd,
}) => {
  return (
    <>
      <AddMetricForm onAdd={onAdd} />
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
    </>
  );
};