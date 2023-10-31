import React, { useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'
import Home from './Home'
import Login from './Login'
import Register from './Register'
import Nav from './Nav'

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
          <hr />
           <Navigate replace to="/" />
        </BrowserRouter>
      </>
    );
  }
}

export default App;
