import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from 'react-router-dom'
import Home from './Home'
import Login from './Login'
import Button from '@mui/material/Button';

const Nav = () => {
  return (
    <>
      <span> <Link to="/">Home</Link> </span>
      <Button variant="contained"> <Link to="/login">login</Link> </Button>
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
        </Routes>
      </BrowserRouter>
    </>

  );
}

export default App;
