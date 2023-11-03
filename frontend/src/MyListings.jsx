import React, { useState, useEffect } from 'react';
import CreateListingPopup from './CreateListingPopup';

const MyListings = () => {
  const [listings, setListings] = useState()
  useEffect(() => {
    async function getAllListings () {
      const reqData = {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
      }
      try {
        const fetchResponse = await fetch('http://localhost:5005/listings', reqData);
        const data = await fetchResponse.json();
        if (data) {
          setListings(data)
        }
      } catch (e) {
        alert(e)
      }
    }
    getAllListings()
  }, [])

  useEffect(() => {
    if (listings && listings && listings.length !== 0) { console.log('listings: ', listings) }
  }, [listings])

  return (
      <div>
          <CreateListingPopup/>
          <div>my listings</div>
      </div>
  )
}

export default MyListings
