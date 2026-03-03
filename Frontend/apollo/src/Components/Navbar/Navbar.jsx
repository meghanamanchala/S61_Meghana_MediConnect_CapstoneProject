import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import logo from "../assests/logo.jpeg";
import account from '../assests/account.png'
import "./Navbar.css";
import axios from 'axios'; 
import Cookies from 'js-cookie';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverCloseButton,
} from '@chakra-ui/react'

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(Cookies.get('loggedIn') === 'true');

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/logout`);
      if (response.status === 200) {
        Cookies.remove('loggedIn', { path: '/' });
        Cookies.remove('username', { path: '/' });
        Cookies.remove('token',{path:'/'});
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className='nav-section'>
      <div className='nav-container'>
        
        {/* Left - Logo */}
        <div className='nav-left'>
          <Link to="/">
            <img className='logo' src={logo} alt="Logo" />
          </Link>
        </div>

        {/* Center - Navigation Links */}
        <div className='nav-center'>
          <div className='nav-link-item'>
            <NavLink to="/">HOME</NavLink>
          </div>
          <div className='nav-link-item'>
            <NavLink to="/appointment">APPOINTMENT</NavLink>
          </div>
          <div className='nav-link-item'>
            <NavLink to="/patients">PATIENTS DATA</NavLink>
          </div>
          <div className='nav-link-item'>
            <NavLink to="/queries">QUERIES</NavLink>
          </div>
        </div>

        {/* Right - Account / Logout */}
        <div>
          {isLoggedIn ? (
            <button className='logout-btn' onClick={handleLogout}>LOGOUT</button>
          ) : (
            <Popover>
              <PopoverTrigger>
                <img className='account' src={account} alt="account" />
              </PopoverTrigger>
              <PopoverContent className='auth-popover'>
                <PopoverCloseButton />
                <Link className='auth-link' to='/login'>Login</Link>
              </PopoverContent>
            </Popover>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;