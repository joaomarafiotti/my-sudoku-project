import React, { useEffect, useState } from 'react'; 
import { useNavigate } from 'react-router-dom';

const RequireAuth = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(token ? true : false); 
  }, []); 
  return children; 
};

export default RequireAuth;
