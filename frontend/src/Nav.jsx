import React from 'react'
import {
  Link
} from 'react-router-dom'
import Logout from './Logout'
import styles from './nav.module.css'

const Nav = () => {
  return (
      <div className={styles.bigblue}>
        <Link to="/">Home</Link>
        <Link to="/login">login</Link>
        <Link to="/register">register</Link>
        <Logout />
      </div>
  )
}

export default Nav
