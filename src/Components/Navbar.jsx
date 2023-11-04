import React, { useState, useEffect } from 'react';
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as RiIcons from "react-icons/ri";
import { IconContext } from 'react-icons';
import { useLocation } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './Navbar.css';
import '../App.css';
import { getLoggedInUserRole, logout, isUserLoggedIn } from '../AuthService';

function Navbar() {
  const [sidebar, toggleSidebar] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const location = useLocation();

  const showSidebar = () => toggleSidebar(!sidebar);

  useEffect(() => {
    const userVerification = async () => {
      const userRole = await getLoggedInUserRole();
      setIsAdmin(userRole === 3);

      const checkLoggedIn = isUserLoggedIn();
      console.log('Checking if the user is logged in: ' + checkLoggedIn);
      setLoggedIn(checkLoggedIn);
    };

    userVerification();
  }, [location]);

  return (
    <>
      <IconContext.Provider value={{ color: 'white' }}>
        <div className="navbar">
          {loggedIn && (
            <div style={{display: "flex", flex: "auto", justifyContent: "end", marginRight: "20px"}}>
              <Dropdown>
                <Dropdown.Toggle style={{ backgroundColor: 'transparent', borderColor: 'transparent' }}>
                  <FaIcons.FaBars style={{ fontSize: '35px' }} />
                </Dropdown.Toggle>
                
                <IconContext.Provider value={{ color: "black" }}>
                  <Dropdown.Menu>
                    <Dropdown.Item href="/calendar"><AiIcons.AiFillCalendar /> Calendar</Dropdown.Item>
                    <Dropdown.Item href="/user-settings"><AiIcons.AiFillSetting /> Settings</Dropdown.Item>
                    {isAdmin && ( <Dropdown.Item href="/admin-dashboard"><RiIcons.RiAdminFill /> Admin</Dropdown.Item> )}
                    <NavDropdown.Divider />
                    <Dropdown.Item href="/login" onClick={() => logout()}><AiIcons.AiOutlineLogout /> Logout</Dropdown.Item>
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