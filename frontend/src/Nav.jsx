import React from 'react'
import {
  Link
} from 'react-router-dom'
import Logout from './Logout'
// import MyListings from './MyListings'
// import AllListings from './AllListings'
import styles from './nav.module.css'

const Nav = (props) => {
  const { isLoggedIn, setIsLoggedIn } = props
  if (!isLoggedIn) {
    return (
      <div className={styles.bigblue}>
        <Link to="/">Home</Link>
        <Link to="/login">login</Link>
       <Link to="/register">register</Link>

      </div>
    )
  } else {
    return (
    <div className={styles.bigblue}>
      <Link to="/">Home</Link>

     <Link to="/mylistings">my listings</Link>
     <Link to="/alllistings">all listings</Link>
     <Logout setIsLoggedIn={setIsLoggedIn} />
    </div>
    )
  }
}
export default Nav
