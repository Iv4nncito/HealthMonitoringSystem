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

    // Reset error state on submit attempt
    setError('');

    // Validate form data
    const { type, value, date } = formData;
    if (!type || !value || !date) {
      setError('Please fill in all fields: Metric Type, Value, and Date.');
      return;
    }

    const numericValue = parseInt(value, 10);
    if (isNaN(numericValue)) {
      setError('Value must be a valid number.');
      return;
    }

    // Add additional validations if necessary
    // Example: Validate date format, range of values, etc.

    try {
      addMetric({ type, value: numericValue, date });

      // Reset form on successful metric addition
      setFormData({ type: '', value: '', date: '' });
    } catch (error) {
      // Assuming the catch block catches a typical Error object
      setError(`Failed to add metric. Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('Error adding metric:', error);
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

export default HealthMetricForm;