import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function SearchDropdown () {
  const [filter, setFilter] = React.useState('');

  const handleChange = (event) => {
    setFilter(event.target.value);
  };

  useEffect(() => {
    console.log('search filter: ', filter)
  }, [filter])

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Search By</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={filter}
          label="Seach By"
          onChange={handleChange}
        >
          <MenuItem value={'title'}>Property title</MenuItem>
          <MenuItem value={'city'}>City</MenuItem>
          <MenuItem value={'price'}>Price</MenuItem>
          <MenuItem value={'numOfBedrooms'}>Number of bedrooms</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
