import React from 'react';
import styles from './Home.module.css'
import ListingCard from './ListingCard'

const Home = (props) => {
  const { allListings } = props
  return (
    <div className={styles.listings}>
    {allListings && allListings.map((l, i) => <ListingCard key={i} data={l} />)}
    </div>
  )
};

export default Home
