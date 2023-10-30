import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from 'react-router-dom'
import Home from './Home'
import Login from './Login'
import Register from './Register'
import Button from '@mui/material/Button';

const Nav = () => {
  return (
    <>
      <span> <Link to="/">Home</Link> </span>
      <Button variant="contained"> <Link to="/login">login</Link> </Button>
      <Button variant="contained"> <Link to="/register">register</Link> </Button>
    </>
  )
}
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
