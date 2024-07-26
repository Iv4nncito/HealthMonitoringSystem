import React, { useState } from 'react';

interface HealthMetricFormProps {
  addMetric: (metric: { type: string; value: number; date: string }) => void;
}

interface FormState {
  type: string;
  value: string;
  date: string;
}

const HealthMetricForm: React.FC<HealthMetricFormProps> = ({ addMetric }) => {
  const [formData, setFormData] = useState<FormState>({ type: '', value: '', date: '' });
  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setError('');

    if (!formData.type || !formData.value || !formData.date) {
      setError('Please, fill in all fields: Metric Type, Value, and Date.');
      return;
    }

    const value = parseInt(formData.value);
    if (isNaN(value)) {
      setError('Value must be a valid number.');
      return;
    }

    try {
      addMetric({ type: formData.type, value, date: formData.date });

      setFormData({ type: '', value: '', date: '' });
    } catch (error: any) {
      setError('Failed to add metric. Please try again.');
      console.error('Error adding metric', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label htmlFor="type">Metric Type</label>
        <input
          type="text"
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="value">Value</label>
        <input
          type="text"
          id="value"
          name="value"
          value={formData.value}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="date">Date</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Add Metric</button>
    </form>
  );
};

export default HealthMetricStyleForm;