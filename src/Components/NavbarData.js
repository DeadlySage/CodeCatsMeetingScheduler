import React from 'react'
import * as AiIcons from "react-icons/ai";

export const NavbarData = [
    // {
    //     title: 'Home',
    //     path: '/home',
    //     icon: <AiIcons.AiFillHome />,
    //     className: 'nav-text',
    // },
    {
        title: 'Login',
        path: '/login',
        icon: <AiIcons.AiOutlineLogin />,
        className: 'nav-text',
    },
    {
        title: 'Calendar',
        path: '/calendar',
        icon: <AiIcons.AiFillCalendar />,
        className: 'nav-text',
    },
    {
        title: 'Settings',
        path: '/',
        icon: <AiIcons.AiFillSetting />,
        className: 'nav-text',
    },
    {
        title: 'Logout',
        path: '/',
        icon: <AiIcons.AiOutlineLogout />,
        className: 'nav-text',
    }
]
