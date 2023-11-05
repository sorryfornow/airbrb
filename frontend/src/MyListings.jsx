import React, { useState, useEffect } from 'react';
import CreateListingPopup from './CreateListingPopup';
import MyListingCard from './MyListingCard';
import styles from './MyListings.module.css'

const MyListings = (props) => {
  const { myListings } = props
  const [listings, setListings] = useState([])

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
  }, [])

  return (
      <div >
          <CreateListingPopup listings={listings} setListings={setListings}/>
          <div className={styles.myListings}>
           {listings && listings.map((l, i) => <MyListingCard key={i} data={l} />)}
          </div>

      </div>
  )
}

export default MyListings
