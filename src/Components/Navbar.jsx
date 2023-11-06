import React, { useState, useEffect } from 'react';
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as RiIcons from "react-icons/ri";
import { MdOutlineLogout } from "react-icons/md";
import { IconContext } from 'react-icons';
import { useLocation } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './Navbar.css';
import '../App.css';
import { getLoggedInUserRole, logout, isUserLoggedIn } from '../AuthService';
import logo from '../codecats-logo-small.png';

function Navbar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const location = useLocation();
  const[headerText, setHeaderText] = useState('');

  useEffect(() => {
    const userVerification = async () => {
      const userRole = await getLoggedInUserRole();
      setIsAdmin(userRole === 3);

      const checkLoggedIn = isUserLoggedIn();
      console.log('Checking if the user is logged in: ' + checkLoggedIn);
      setLoggedIn(checkLoggedIn);
    };

    switch(window.location.pathname) {
      case '/calendar': 
        setHeaderText('Calendar');
        break;
      case '/admin-dashboard':
        setHeaderText('Dashboard');
        break;
      default: 
        setHeaderText('');
    }

    userVerification();
  }, [location]);

  return (
    <>
      <IconContext.Provider value={{ color: 'white' }}>
        <div className="navbar">
          <div style={{display: "flex", flex: "auto", justifyContent: "start", marginLeft: "20px"}} >
            <img src={logo} alt="Logo" style={{ width: '70px', height: 'auto' }} />
          </div>
          <div style={{display: "flex", flex: "auto", justifyContent: "center"}} >
            <h1>{headerText}</h1>
          </div>
          {loggedIn && (
            <div style={{display: "flex", flex: "auto", justifyContent: "end", marginRight: "20px"}}>
              <Dropdown>
                <Dropdown.Toggle style={{ backgroundColor: 'transparent', borderColor: 'transparent' }}>
                  <FaIcons.FaBars style={{ fontSize: '35px' }} />
                </Dropdown.Toggle>
                
                <IconContext.Provider value={{ color: "black" }}>
                  <Dropdown.Menu className='menu-dropdown'>
                    <Dropdown.Item href="/calendar" className="navbar-dropdown-item">
                      <span>Calendar</span>
                      <AiIcons.AiOutlineCalendar />
                    </Dropdown.Item>
                    <Dropdown.Item href="/user-settings" className="navbar-dropdown-item">
                      <span>Settings</span>
                      <AiIcons.AiOutlineSetting />
                    </Dropdown.Item>
                    {isAdmin && ( 
                      <Dropdown.Item href="/admin-dashboard" className="navbar-dropdown-item">
                        <span>Admin</span>
                        <RiIcons.RiAdminLine />
                      </Dropdown.Item> 
                    )}
                    <NavDropdown.Divider />
                    <Dropdown.Item 
                      href="/login" 
                      onClick={() => logout()} 
                      className="navbar-dropdown-item"
                    >
                      <span>Logout</span>
                      <MdOutlineLogout />
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </IconContext.Provider>
              </Dropdown>
            </div>
          )}
        </div>
      </IconContext.Provider>
    </>
  )
}

export default Navbar;