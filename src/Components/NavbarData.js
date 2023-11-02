import React from 'react'
import * as AiIcons from "react-icons/ai";

export const NavbarData = [
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
        path: '/user-settings',
        icon: <AiIcons.AiFillSetting />,
        className: 'nav-text',
    }
]
