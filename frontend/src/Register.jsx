import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const Register = (props) => {
  const { setIsLoggedIn } = props

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleRegistrationSubmit = async () => {
    if (password !== confirmPassword) alert('passwords entered do not match')
    const payload = {
      email,
      name,
      password,
    }
    console.log(payload)
    const reqData = {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    }
    try {
      const fetchResponse = await fetch('http://localhost:5005/user/auth/register', reqData);
      const data = await fetchResponse.json();
      localStorage.setItem('jwtToken', data.token)
      setIsLoggedIn(true)
    } catch (e) {
      alert(e)
    }
  }
  const onEmailChange = (e) => setEmail(e.target.value);
  const onNameChange = (e) => setName(e.target.value);
  const onPasswordChange = (e) => setPassword(e.target.value);
  const onConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  return (
  <div>register:
          <TextField onChange={onEmailChange} id="register-email" label="email" variant="outlined" />
          <TextField onChange={onNameChange} id="register-name" label="name" variant="outlined" />
          <TextField onChange={onPasswordChange} id="register-password" label="password" variant="outlined" />
          <TextField onChange={onConfirmPasswordChange} id="register-confirm-password" label="confirm password" variant="outlined" />
          <Button onClick={handleRegistrationSubmit} variant="contained">Register</Button>
  </div>)
}

export default Register
