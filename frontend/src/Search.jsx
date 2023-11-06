import React from 'react';
import SearchDropdown from './SearchDropdown';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import styles from './Search.module.css'

export default function Search (props) {
  return (
    <div className={styles.search}>
        <SearchDropdown/>
        <TextField id="outlined-basic" label="value" variant="outlined" />
        <Button variant="contained">Search</Button>
    </div>
  );
}
