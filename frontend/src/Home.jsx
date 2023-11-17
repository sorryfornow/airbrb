import React, { useState, useEffect } from 'react';
import styles from './Home.module.css'
import ListingCard from './ListingCard'
import Search from './Search'

const Home = (props) => {
  const { allListings, setAllListings, reload, setReload } = props
  const [publishedListings, setPublishedListings] = useState([])

  useEffect(() => {
    const arr = []
    const listingIDs = allListings.map((l) => l.id)
    async function getPublished (id, len, idx) {
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
          if (res.listing.published) { arr.push(res.listing) }
          if (len - 1 === idx) {
            setPublishedListings(arr)
          }
        }
      } catch (e) {
        alert(e)
      }
    }
    for (let i = 0; i < listingIDs.length; i++) {
      getPublished(listingIDs[i], listingIDs.length, i)
    }
  }, [allListings])

  useEffect(() => {
  }, [publishedListings])
  return (
    <>
    <div>All Listings:</div>
    <Search allListings={allListings} setAllListings={setAllListings} reload={reload} setReload={setReload}/>
    <div className={styles.listings}>
    {publishedListings.length > 0 && publishedListings && publishedListings.map((l, i) => <ListingCard key={i} data={l} />)}
    </div>
    </>
  )
};

export default Home
