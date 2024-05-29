import React, { memo, useState, useEffect } from 'react';

const MyComponent = memo(function MyComponent(props) {
  const [data, setData] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await new Promise<string>((resolve) => {
        setTimeout(() => resolve("Fetched Data"), 1500);
      });

      if (response) {
        setData(response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("Periodic task");
    }, 1000);

    fetchData();

    return () => clearTimeout(timer); 
  }, []);

  return (
    <div>
      <h1>Health Monitoring System</h1>
      <p>{data ? data : "Loading data..."}</p>
    </div>
  );
});

export default MyComponent;