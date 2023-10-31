import React from 'react';
import Button from '@mui/material/Button';

const Logout = (props) => {
  const { setIsLoggedIn } = props

  const handleLogout = async () => {
    const jwtToken = localStorage.getItem('jwtToken');

    const reqData = {
      method: 'POST',
      body: '',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`
      }
    }
    try {
      const fetchResponse = await fetch('http://localhost:5005/user/auth/logout', reqData);
      const data = await fetchResponse.json();
      console.log('logout res: ', data)
      setIsLoggedIn(false)
    } catch (e) {
      alert(e)
    }
  }

  return (
  <div>
    <Button onClick={handleLogout} variant="contained">Logout</Button>
  </div>)
}

export default Logout
