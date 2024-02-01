// Register.js

import React, { useState } from 'react';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async(e) => {
    e.preventDefault();
    const formData={
        name,email,role,phone,password
    }
    try {
        const response = await fetch('https://englishquestapi.onrender.com/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        }).then(res=>res.json()).then((res)=>{
            const token=`Bearer ${res.token}`
            if(res.user.role){

                const role=res.user.role
                localStorage.setItem('role', role);
            }
            localStorage.setItem('token', token);
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
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <br />
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        <br />
        <label>Phone:</label>
        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        <br />
        <label>Role:</label>
        <select value={role} onChange={(e) => setRole(e.target.value)} >
          <option value="">Select Role</option>
          <option value="CREATOR">CREATOR</option>
          <option value="VIEW_ALL">VIEW_All</option>
        </select>
        <br />
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <br />
        <button type="submit">Register</button>
      </form>
      <div  style={{width:"90%",margin:"auto",textAlign:"center",marginTop:"20px"}}>
      <Link to="/login">Already a member Please click here to login</Link>
      </div>
    </div>
  );
};

export default Register;
