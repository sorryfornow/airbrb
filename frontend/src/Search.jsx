import React, { useState } from 'react';
import SearchDropdown from './SearchDropdown';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { apiCall } from './helpers'
// import PriceSlider from './PriceSlider'
import PriceSlider from './MyPriceSlider'
import DateSelector from './DateSelector';
import styles from './Search.module.css'
import dayjs from 'dayjs';

export default function Search (props) {
  const jwtToken = localStorage.getItem('jwtToken');
  const { allListings, setAllListings, reload, setReload } = props;
  const [searchFilter, setSearchFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([200, 500]);
  const [dates, setDates] = useState([{ id: 'searchDate', start: null, end: null }]);
  // const [reload, setReload] = useState(false);
  // const [copyOfAllListings, setCopyOfAllListings] = []

  const filterBedrooms = async (lstId, numOfBedrooms) => {
    // console.log('filterBedrooms', lstId, parseInt(numOfBedrooms, 10));
    const listWithDetails_ = await apiCall(`listings/${lstId}`, null, jwtToken, 'GET');
    if (!listWithDetails_) {
      console.error('Failed to fetch listing details');
      return false;
    }
    const listWithDetails = listWithDetails_.listing
    return listWithDetails && listWithDetails.metadata && listWithDetails.metadata.bedroomDetails &&
      listWithDetails.metadata.bedroomDetails.length >= parseInt(numOfBedrooms, 10);
  };

  const filterAvailability = async (lstId, searchRange) => {
    const listWithDetails_ = await apiCall(`listings/${lstId}`, null, jwtToken, 'GET');
    if (!listWithDetails_) {
      console.error('Failed to fetch listing details');
      return false;
    }
    let res = false;
    listWithDetails_.listing.availability.forEach(availability => {
      const listingRange = {
        start: dayjs(availability.start).format('YYYY-MM-DD'),
        end: dayjs(availability.end).format('YYYY-MM-DD')
      };
      if (isDateRangeOverlapping(listingRange, searchRange)) res = true;
    });
    return res;
  };

  const isDateRangeOverlapping = (listingRange, searchRange) => {
    const [searchStart, searchEnd] = [dayjs(searchRange.start), dayjs(searchRange.end)]
    const [listingStart, listingEnd] = [dayjs(listingRange.start), dayjs(listingRange.end)]
    // partial overlap
    return searchStart.isBefore(listingEnd) && searchEnd.isAfter(listingStart);
  };

  const handleTermChange = (e) => {
    setSearchTerm(e.target.value.trim())
  }

  const handleSearch = async () => {
    let filteredListings = allListings;
    const dateRange = dates.find(dt => dt.id === 'searchDate');

    switch (searchFilter) {
      case 'title':
        filteredListings = allListings.filter(listing =>
          listing[searchFilter] && listing[searchFilter].toLowerCase().includes(searchTerm.toLowerCase()));
        break;
      case 'city':
        filteredListings = allListings.filter(listing =>
          listing.address && listing.address.city &&
            listing.address.city.toLowerCase().includes(searchTerm.toLowerCase()));
        break;

      case 'numOfBedrooms':
        if (isNaN(parseInt(searchTerm, 10))) {
          console.error('Invalid searchTerm for number of bedrooms');
          break;
        }
        filteredListings = (await Promise.all(
          allListings.map(async (listing) => {
            const result = await filterBedrooms(listing.id, searchTerm);
            return result ? listing : null;
          })
        )).filter(listing => listing !== null);
        break;

      case 'price':
        filteredListings = allListings.filter(listing =>
          listing.price >= priceRange[0] && listing.price <= priceRange[1]);
        break;

      case 'date':
        filteredListings = (await Promise.all(
          allListings.map(async (listing) => {
            const result = await filterAvailability(listing.id, {
              start: dayjs(dateRange.start).format('YYYY-MM-DD'),
              end: dayjs(dateRange.end).format('YYYY-MM-DD')
            });
            return result ? listing : null;
          })
        )).filter(listing => listing !== null);
        break;

      case 'reviewRatings':
        // TODO
        break;
      // additional cases
      default:
        break;
    }
    // TODO sort by rating
    setAllListings(filteredListings);
  };

  const handleRemoveFilter = () => {
    // setSearchFilter('');
    // setSearchTerm('');
    // setPriceRange([200, 500]);
    // setDates([{ id: 'searchDate', start: null, end: null }]);
    setReload(!reload)
  };

  return (
    <div className={styles.search}>
        <SearchDropdown searchFilter={searchFilter} setSearchFilter={setSearchFilter} data-cy="search-dropdown"/>
        {(searchFilter !== 'price' && searchFilter !== 'date') && <TextField onChange={handleTermChange} id="outlined-basic" label="value" variant="outlined" data-cy="search-value"/>}
        {searchFilter === 'price' && <PriceSlider value={priceRange} onChange={setPriceRange}/>}
        {searchFilter === 'date' && <DateSelector id="searchDate" dates={dates} setDates={setDates}/>}
        <Button onClick={handleSearch} variant="contained" data-cy="search-button">Search</Button>
        <Button onClick={handleRemoveFilter} variant="contained" data-cy="remove-filter-button">Remove Filter</Button>
    </div>
  );
}
