import React, { useState, useEffect } from 'react';
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as RiIcons from "react-icons/ri";
import { IconContext } from 'react-icons';
import { Link, useLocation } from 'react-router-dom';
import { NavbarData } from './NavbarData';
import '../App.css';
import { getLoggedInUserRole, logout } from '../AuthService';

function Navbar() {
  const [sidebar, toggleSidebar] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  const showSidebar = () => toggleSidebar(!sidebar);

  useEffect(() => {
    const checkAdminRole = async () => {
      const userRole = await getLoggedInUserRole();
      setIsAdmin(userRole === 3); // Admin Role
    };

    checkAdminRole();
  }, [location]);

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <IconContext.Provider value={{ color: 'white' }}>
        <div className="navbar">
          <Link to="#" className='menu-icon'>
            <FaIcons.FaBars onClick={showSidebar} />
          </Link>
        </div>
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <ul className='nav-menu-items' onClick={showSidebar}>
            <li className="navbar-toggle">
              <Link to="#" className='menu-icon'>
                <AiIcons.AiFillCloseCircle />
              </Link>
            </li>
            {NavbarData.map((item, index) => (
              <li key={index} className={item.className}>
                <Link to={item.path}>
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
            {isAdmin && (
              <li className="nav-text">
                <Link to="/admin-dashboard" className="menu-items">
                  <RiIcons.RiAdminFill />
                  <span>Admin</span>
                </Link>
              </li>
            )}
            <li className="nav-text">
              <Link to="/login" className="menu-items" onClick={handleLogout}>
                <AiIcons.AiOutlineLogout />
                <span>Logout</span>
              </Link>
            </li>
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  )
}

export default Navbar;
