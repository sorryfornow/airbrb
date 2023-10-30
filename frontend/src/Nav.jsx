import React from 'react'
import {
  Link
} from 'react-router-dom'

const Nav = () => {
  return (
      <>
        <span> <Link to="/">Home</Link> </span>
        <Link variant="contained"> <Link to="/login">login</Link> </Link>
        <Link variant="contained"> <Link to="/register">register</Link> </Link>
      </>
  )
}

export default Nav
