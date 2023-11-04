import React, { useState, useEffect } from 'react';
import CreateListingPopup from './CreateListingPopup';
import MyListingCard from './MyListingCard';
import styles from './MyListings.module.css'

const MyListings = (props) => {
  const { myListings } = props
  const [listings, setListings] = useState()

  useEffect(() => {
    setListings(myListings)
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
