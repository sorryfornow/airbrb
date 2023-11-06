import React, { useState } from 'react';
import SearchDropdown from './SearchDropdown';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import styles from './Search.module.css'

export default function Search (props) {
  const [searchFilter, setSearchFilter] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const handleTermChange = (e) => {
    setSearchTerm(e.target.value)
  }
  const handleSearch = () => {
    console.log('search filter and term: ', searchFilter, searchTerm)
  }

  return (
    <div className={styles.search}>
        <SearchDropdown searchFilter={searchFilter} setSearchFilter={setSearchFilter}/>
        <TextField onChange={handleTermChange} id="outlined-basic" label="value" variant="outlined" />
        <Button onClick={handleSearch} variant="contained">Search</Button>
    </div>
  );
}
