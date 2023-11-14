import React from 'react';
import { Slider, Box, Typography } from '@mui/material';

export default function PriceSlider ({ value, onChange }) {
  const handleChange = (event, newValue) => {
    onChange(newValue);
  };

  return (
    <Box sx={{ width: 300 }}>
      <Typography id="range-slider" gutterBottom>
        Price Range
      </Typography>
      <Slider
        min={0}
        max={2000} // Set the maximum limit for the price range
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        getAriaValueText={(value) => `$${value}`}
      />
    </Box>
  );
}
