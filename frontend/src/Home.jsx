import React from 'react';
import styles from './Home.module.css'
import ListingCard from './ListingCard'
import Search from './Search'

const Home = (props) => {
  const { allListings } = props
  return (
    <>
    <div>All Listings:</div>
    <Search/>
    <div className={styles.listings}>
    {allListings && allListings.map((l, i) => <ListingCard key={i} data={l} />)}
    </div>
    </>
  )
};

export default Home
