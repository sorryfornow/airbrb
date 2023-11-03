import React, { useState, useEffect } from 'react';
import CreateListingPopup from './CreateListingPopup';
import MyListingCard from './MyListingCard';

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
          console.log('data: ', data)
          const mylistings = data.listings.filter((l) => l.owner === localStorage.getItem('userEmail'))
          setListings(mylistings)
        }
      } catch (e) {
        alert(e)
      }
    }
    getAllListings()
  }, [])

  useEffect(() => {
    if (listings && listings && listings.length !== 0) { console.log('final listings: ', listings) }
  }, [listings])

  return (
      <div>
          <CreateListingPopup/>
          {listings && listings.map((l, i) => <MyListingCard key={i} data={l}/>)}
      </div>
  )
}

export default MyListings
