import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function SearchDropdown (props) {
  const { searchFilter, setSearchFilter } = props

  const handleChange = (event) => {
    setSearchFilter(event.target.value);
  };

  useEffect(() => {
  }, [searchFilter])

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Search By</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={searchFilter}
          label="Seach By"
          onChange={handleChange}
        >
          <MenuItem value={'title'}>Property Title</MenuItem>
          <MenuItem value={'city'}>City</MenuItem>
          <MenuItem value={'price'}>Price Range</MenuItem>
          <MenuItem value={'numOfBedrooms'}>Number of Bedrooms</MenuItem>
          <MenuItem value={'date'}>Date range</MenuItem>
          <MenuItem value={'reviewRatings'}>Review Ratings</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
