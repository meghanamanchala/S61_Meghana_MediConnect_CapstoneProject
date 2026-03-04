import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import logo from "../assets/common/logo.jpeg";
import account from '../assets/common/account.png'
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
  const [accountImgError, setAccountImgError] = useState(false);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/logout`);
      if (response.status === 200) {
        Cookies.remove('loggedIn', { path: '/' });
        Cookies.remove('username', { path: '/' });
        Cookies.remove('token',{path:'/'});
        Cookies.remove('email',{path:'/'});
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
            <Popover placement='bottom-end'>
              <PopoverTrigger>
                <button type='button' className='account-trigger' aria-label='Account options'>
                  {accountImgError ? (
                    <span className='account-fallback' aria-hidden='true'>👤</span>
                  ) : (
                    <img
                      className='account'
                      src={account}
                      alt='account'
                      onError={() => setAccountImgError(true)}
                    />
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className='auth-popover'>
                <PopoverCloseButton className='auth-close' />
                <div className='auth-actions'>
                  <Link className='auth-link' to='/login'>Login</Link>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;