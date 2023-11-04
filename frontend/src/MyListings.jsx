import React, { useState, useEffect } from 'react';
import CreateListingPopup from './CreateListingPopup';
import MyListingCard from './MyListingCard';
import styles from './MyListings.module.css'

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

  }, [listings])

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
