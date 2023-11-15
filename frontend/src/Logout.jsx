import React from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const Logout = (props) => {
  const { setIsLoggedIn } = props
  const navigate = useNavigate();

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
      if (data.error) { alert(data.error); return }
      navigate('/', { replace: true });
      setIsLoggedIn(false)
    } catch (e) {
      alert(e)
    }
  }

  return (
  <div>
    <Button onClick={handleLogout} variant="contained" data-cy="logout-button">Logout</Button>
  </div>)
}

export default Logout
