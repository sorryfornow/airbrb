import React from 'react';
import Button from '@mui/material/Button';

const Logout = () => {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')

  //   const handleLoginSubmit = async () => {
  //     const payload = {
  //       email,
  //       password,
  //     }
  //     const reqData = {
  //       method: 'POST',
  //       body: JSON.stringify(payload),
  //       headers: {
  //         Accept: 'application/json',
  //         'Content-Type': 'application/json',
  //       }
  //     }
  //     try {
  //       const fetchResponse = await fetch('http://localhost:5005/user/auth/login', reqData);
  //       const data = await fetchResponse.json();
  //       console.log('login res: ', data)
  //       localStorage.setItem('jwtToken', data.token)
  //     } catch (e) {
  //       alert(e)
  //     }
  //   }
  //   const onEmailChange = (e) => setEmail(e.target.value);
  //   const onPasswordChange = (e) => setPassword(e.target.value);

  return (
  <div>
    <Button variant="contained">Logout</Button>
  </div>)
}

export default Logout
