import React, { useState, useEffect } from 'react';
import {
  Routes,
  Route,
} from 'react-router-dom'
import Home from './Home'
import Login from './Login'
import Register from './Register'
import Nav from './Nav'
import MyListings from './MyListings';
import MyBookings from './MyBookings';
import EditListing from './EditListing';
import Listing from './Listing'
function App () {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [allListings, setAllListings] = useState([])
  const [reload, setReload] = useState(false);

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
          setAllListings(data.listings)
        }
      } catch (e) {
        alert(e)
      }
    }
    getAllListings()
  }, [reload])

  if (!isLoggedIn) {
    return (
    <>
        <Nav isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <hr />
        <Routes>
          <Route path="/" element={<Home allListings={allListings} setAllListings={setAllListings} reload={reload} setReload={setReload}/>} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<Register setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/:id" element={<Listing />} />
        </Routes>
    </>
    );
  } else {
    return (
      <>
          <Nav isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          <hr />
          <Routes>
            <Route path="/" element={<Home allListings={allListings} setAllListings={setAllListings} reload={reload} setReload={setReload}/>} />
            <Route path="/:id" element={<Listing />} />
            <Route path="/mylistings" element={<MyListings allListings={allListings} setAllListings={setAllListings}/>}/>
            <Route path="/mybookings" element={<MyBookings allListings={allListings} setAllListings={setAllListings}/>}/>
            <Route path="/mylistings/:id" element={<EditListing allListings={allListings} setAllListings={setAllListings}/>} />
          </Routes>
          <hr />
      </>
    );
  }
}

export default App;
