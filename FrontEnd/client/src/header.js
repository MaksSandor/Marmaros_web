import React from 'react';
import { useNavigate } from 'react-router-dom';
import header_style from './header_style.module.css'

function Header() {

    const navigate = useNavigate();

    const navigateMain = () => {
        navigate('/');
    };

     const navigateAbout = () => {
        navigate('/about');
    };

     const navigateTours = () => {
        navigate('/tours');
    };

    return (
        <header>
            <button onClick={navigateAbout} className={header_style.About}>Про нас</button>
            <button onClick={navigateMain} className={header_style.Main}>Головна</button>
            <button onClick={navigateTours} className={header_style.Tours}>Тури</button>
        </header>
    )
}

export default Header;