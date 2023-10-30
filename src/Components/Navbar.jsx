import React, {useState} from 'react';
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { IconContext } from 'react-icons';
import {Link} from 'react-router-dom';
import {NavbarData} from './NavbarData';
import '../App.css';

function Navbar() {
    const [sidebar, toggleSidebar] = useState(false)

    const showSidebar = () => toggleSidebar(!sidebar)

    return (
        <>
        <IconContext.Provider value={{color: 'white'}}>
            <div className = "navbar">
                <Link to="#" className='menu-icon'>
                    <FaIcons.FaBars onClick = {showSidebar}/>
                </Link>
            </div>
            <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                <ul className='nav-menu-items' onClick={showSidebar}>
                    <li className="navbar-toggle">
                        <Link to="#" className='menu-icon'>
                            <AiIcons.AiFillCloseCircle />
                        </Link>
                    </li>
                    {NavbarData.map((item, index) => {
                        return (
                            <li key={index} className={item.className}>
                                <Link to={item.path}>
                                    {item.icon}
                                    <span>{item.title}</span>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>
            </IconContext.Provider>
        </>
    
    
  )
}

export default Navbar