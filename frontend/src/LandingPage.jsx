import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './LandingPage.module.css';
import { apiCall } from './helpers.js';

function ListingsPage () {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    const jwtToken = localStorage.getItem('jwtToken');
    try {
      const listingsData = await apiCall('listings', null, jwtToken, 'GET');
      setListings(listingsData); // Use the data directly as it is parsed in apiCall.
    } catch (err) {
      console.error('Failed to fetch listings:', err);
    }
  };

  // Example Value of Listing
  // {
  //   "listings": [
  //     {
  //       "id": 56513315,
  //       "title": "Oceanside Villa",
  //       "owner": "alina@unsw.edu.au",
  //       "address": {},
  //       "thumbnail": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==",
  //       "price": 350,
  //       "reviews": [
  //         {}
  //       ]
  //     }
  //   ]
  // }

  return (
    <div>
      <h1>Listings</h1>
      <div className={styles.listingsGrid}>
        {listings.slice(0, 20).map(listing => (
          <div key={listing.id} className={styles.listingItem}>
            <Link to={`/listings/${listing.id}`} className={styles.listingLink}>
              <h3 className={styles.listingTitle}>{listing.title}</h3>
              <img src={listing.thumbnail || require('./house_icon_1.png')} alt={listing.title} className={styles.listingImage} />
              <p>Price: ${listing.price}</p>
              <p>Total Reviews: {listing.reviews.length}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListingsPage;
