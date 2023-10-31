import React from 'react'
import {
  Link
} from 'react-router-dom'
import Logout from './Logout'
import styles from './nav.module.css'

const Nav = (props) => {
  console.log('nav props: ', props)
  const { isLoggedIn, setIsLoggedIn } = props
  return (
      <div className={styles.bigblue}>
        <Link to="/">Home</Link>
        {!isLoggedIn && <Link to="/login">login</Link>}
        {!isLoggedIn && <Link to="/register">register</Link>}
        {isLoggedIn && <Logout setIsLoggedIn={setIsLoggedIn} />}
      </div>
  )
}

export default Nav
