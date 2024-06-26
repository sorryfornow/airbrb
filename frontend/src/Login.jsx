import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const Login = (props) => {
  const { setIsLoggedIn } = props
  const navigate = useNavigate();

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      email,
      password,
    }
    const reqData = {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    }
    try {
      const fetchResponse = await fetch('http://localhost:5005/user/auth/login', reqData);
      const data = await fetchResponse.json();
      console.log('login res: ', data)
      if (data.error) { alert(data.error); return }
      if (data) {
        navigate('/', { replace: true });
        setIsLoggedIn(true)
      }
      localStorage.setItem('userEmail', email)
      localStorage.setItem('jwtToken', data.token)
    } catch (e) {
      alert(e)
    }
  }
  const onEmailChange = (e) => setEmail(e.target.value);
  const onPasswordChange = (e) => setPassword(e.target.value);

  return (
  <div>login:
          <TextField onChange={onEmailChange} id="login-email" label="email" variant="outlined" />
          <TextField onChange={onPasswordChange} id="login-password" label="password" variant="outlined" />
          <Button onClick={handleLoginSubmit} variant="contained" data-cy='login-button'>Login</Button>
  </div>)
}

export default Login
