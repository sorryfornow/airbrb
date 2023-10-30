import React from 'react'
import {
  Link
} from 'react-router-dom'
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

export default Nav
