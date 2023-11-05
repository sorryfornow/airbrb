import React, { useState, useEffect } from 'react';
import CreateListingPopup from './CreateListingPopup';
import MyListingCard from './MyListingCard';
import styles from './MyListings.module.css'

const MyListings = (props) => {
  const { myListings } = props
  const [listings, setListings] = useState([])
  const [fullListings, setFullListings] = useState([])

  useEffect(() => {
    setListings(myListings)
    const arr = []
    const listingIDs = myListings.map((l) => l.id)
    console.log('all IDs: ', listingIDs)
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
          console.log('COPY before push: ', arr)

          arr.push(res.listing)
          console.log('COPY after push: ', arr)
          if (arr.length === listingIDs.length) {
            setFullListings(arr)
          }
        }
      } catch (e) {
        alert(e)
      }
    }
    for (let i = 0; i < listingIDs.length; i++) {
      getFullListing(listingIDs[i])
    }
    console.log('arrrrr: ', arr)
  }, [])

  useEffect(() => {
    console.log('full listings: ', fullListings)
  }, [fullListings])

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
