import React, { useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'
import Home from './Home'
import Login from './Login'
import Register from './Register'
import Nav from './Nav'
import MyListings from './MyListings';

function App () {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  if (!isLoggedIn) {
    return (
    <>
      <BrowserRouter>
        <Nav isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <hr />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<Register setIsLoggedIn={setIsLoggedIn} />} />
        </Routes>
      </BrowserRouter>
    </>
    );
  } else {
    return (
      <>
        <BrowserRouter>
          <Nav isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mylistings" element={<MyListings />} />
        </Routes>
          <hr />
        </BrowserRouter>
      </>
    );
  }
}

export default App;
