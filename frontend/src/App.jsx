import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'
import Home from './Home'
import Login from './Login'
import Register from './Register'
import Nav from './Nav'

function App () {
  return (
    <>
      <BrowserRouter>
        <Nav />
        <hr />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </>

  );
}

export default App;
