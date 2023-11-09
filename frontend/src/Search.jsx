import React, { useState } from 'react';
import SearchDropdown from './SearchDropdown';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import PriceSlider from './PriceSlider'
import DateSelector from './DateSelector';
import styles from './Search.module.css'

export default function Search (props) {
  const { allListings, setAllListings, reload, setReload } = props
  const [searchFilter, setSearchFilter] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  // const [copyOfAllListings, setCopyOfAllListings] = []

  const handleTermChange = (e) => {
    setSearchTerm(e.target.value)
  }
  const handleSearch = () => {
    console.log('search filter and term: ', searchFilter, searchTerm)
    // const refinedListings = []
    const first = [...allListings][0]
    setAllListings([first])
  }

  const handleRemoveFilter = () => {
    setReload(!reload)
  }

  return (
    <div className={styles.search}>
        <SearchDropdown searchFilter={searchFilter} setSearchFilter={setSearchFilter}/>
        {(searchFilter !== 'price' && searchFilter !== 'date') && <TextField onChange={handleTermChange} id="outlined-basic" label="value" variant="outlined" />}
        {searchFilter === 'price' && <PriceSlider/>}
        {searchFilter === 'date' && <DateSelector/>}
        <Button onClick={handleSearch} variant="contained">Search</Button>
        <Button onClick={handleRemoveFilter} variant="contained">Remove Filter</Button>
    </div>
  );
}
