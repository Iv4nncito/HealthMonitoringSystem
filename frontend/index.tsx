import React, { memo } from 'react';

const MyComponent = memo(function MyComponent(props) {
  // Component logic
});

useEffect(() => {
  const timer = setTimeout(() => {
    // Do something
  }, 1000);

  return () => clearTimeout(timer); // Cleanup
}, []);