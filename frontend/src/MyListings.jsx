import React, { useState, useEffect } from 'react';
import CreateListingPopup from './CreateListingPopup';
import MyListingCard from './MyListingCard';
import { Typography, Container, Paper } from '@mui/material';
import styles from './MyListings.module.css'

const MyListings = (props) => {
  const { allListings, setAllListings } = props;
  const myListings = allListings.filter((l) => l.owner === localStorage.getItem('userEmail'));
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const arr = []
    const listingIDs = myListings.map((l) => l.id)
    async function getFullListing (id) {
      const reqData = {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
      }
      try {
        const fetchResponse = await fetch(`http://localhost:5005/listings/${id}`, reqData);
        const res = await fetchResponse.json();
        if (res) {
          res.listing.id = id
          arr.push(res.listing)
          if (arr.length === listingIDs.length) {
            setListings(arr)
          }
        }
      } catch (e) {
        alert(e)
      }
    }
    for (let i = 0; i < listingIDs.length; i++) {
      getFullListing(listingIDs[i])
    }
  }, [allListings]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        My Listings
      </Typography>
      <CreateListingPopup listings={listings} allListings={allListings} setAllListings={setAllListings} />
      <div className={styles.mylistings}>
        {listings.length > 0
          ? (
              listings.map((listing, index) => (
              <Paper key={index} elevation={2} style={{ padding: '10px', margin: '10px' }}>
                <MyListingCard data={listing} />
              </Paper>
              ))
            )
          : (
              <Typography variant="subtitle1" style={{ marginTop: '10px' }}>
                You currently have no listings.
              </Typography>
            )}
      </div>
    </Container>
  );
};

export default MyListings;
