import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
useEffect(()=>{

},[token])

  if (!token) {
  window.location="/login"
   
  }

  
  return <>{children}</>;
};

export default PrivateRoute;
