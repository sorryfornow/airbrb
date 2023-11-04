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
import EditListingPopup from './EditListingPopup';
function App () {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [allListings, setAllListings] = useState()
  const [myListings, setMyListings] = useState()
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
          const userListings = data.listings.filter((l) => l.owner === localStorage.getItem('userEmail'))
          setAllListings(data.listings)
          setMyListings(userListings)
        }
      } catch (e) {
        alert(e)
      }
    }
    getAllListings()
  }, [])

  useEffect(() => {
  }, [allListings, myListings])
  if (!isLoggedIn) {
    return (
    <>
        <Nav isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <hr />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<Register setIsLoggedIn={setIsLoggedIn} />} />
        </Routes>
    </>
    );
  } else {
    return (
      <>
          <Nav isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mylistings" element={<MyListings myListings={myListings}/>}>
           <Route path="/mylistings/:id" element={<EditListingPopup />} />
          </Route >
          </Routes>
          <hr />
      </>
    );
  }
}

export default App;
