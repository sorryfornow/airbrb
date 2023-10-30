import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from 'react-router-dom'

const Home = () => {
  return <div>Home</div>
}
const Login = () => {
  return <div>login</div>
}

const Nav = () => {
  return (
    <>
      <span> <Link to="/">Home</Link> </span>
      <span> <Link to="/login">login</Link> </span>
    </>
  )
}
function App () {
  return (
    <>

      <BrowserRouter>
        <Nav />
        <hr />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>

  );
}

export default App;
