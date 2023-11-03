import React from 'react'
import {
  Link
} from 'react-router-dom'
import Logout from './Logout'
import styles from './Nav.module.css'

const Nav = (props) => {
  const { isLoggedIn, setIsLoggedIn } = props
  if (!isLoggedIn) {
    return (
      <div className={styles.navBar}>
        <Link to="/">Home</Link>
        <Link to="/login">login</Link>
       <Link to="/register">register</Link>

      </div>
    )
  } else {
    return (
    <div className={styles.navBar}>
      <Link to="/">Home</Link>
     <Link to="/alllistings">all listings</Link>
     <Link to="/mylistings">my listings</Link>
     <Logout setIsLoggedIn={setIsLoggedIn} />
    </div>
    )
  }
}
export default Nav
