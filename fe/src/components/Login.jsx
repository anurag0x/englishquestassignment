// Login.js

import React, { useState } from 'react';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [phone, setPhone] = useState('');

  const handleLogin = async(e) => {
    e.preventDefault();
    const formData={
        email,password
    }
    try {
        const response = await fetch('https://englishquestapi.onrender.com/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        }).then(res=>res.json()).then((res)=>{
            const token=`Bearer ${res.token}`
            const role=res.user.role
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            localStorage.setItem('user',res.user._id)
            // console.log(role,token)
            alert(res.message)
            window.location='/'

        });
  
       
      } catch (error) {
        console.error('Error during registration:', error);
      }
  };

  return (
    <div style={{width:"90%",margin:"auto"}}>
        <Navbar/>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <br />
      
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <br />
        <button type="submit">Login</button>
      </form>
    <div  style={{width:"90%",margin:"auto",textAlign:"center",marginTop:"20px"}}>
    <Link to="/register">Not a member Please click here to register</Link>
    </div>
    </div>
  );
};

export default Login;
