import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';

const FixedButton = () => {
  const [clickCount, setClickCount] = useState(0);

  // Load the click count from local storage when the component mounts
  useEffect(() => {
    const storedCount = localStorage.getItem('clickCount');
    if (storedCount) {
      setClickCount(parseInt(storedCount, 10));
    }
  }, []);

  const handleClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    localStorage.setItem('clickCount', newCount); // Store the new count in local storage
  };

  return (
    <div style={{ position: 'fixed', bottom: '10px', right: '20px', zIndex: 1000 }}>
      <Button
        variant="contained"
        onClick={handleClick}
        sx={{
          borderRadius: '20px',
          padding: '5px 0px',
          backgroundColor: 'black', // Set the background color to black
          color: 'white', // Set the text color to white
          border: '2px solid white', // Set the border color to white
          transition: 'box-shadow 0.3s', // Add transition for box shadow on hover
          '&:hover': {
            boxShadow: '0 0 10px white', // White box shadow on hover
          },
        }}
      >
        {clickCount}
      </Button>
    </div>
  );
};

export default FixedButton;
