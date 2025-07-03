import React from 'react';
import { useNavigate } from 'react-router-dom';

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
            <button onClick={navigateMain} className={header_style.Main}>Main</button>
            <button onClick={navigateAbout} className={header_style.About}>About</button>
            <button onClick={navigateTours} className={header_style.Tours}>Tours</button>
        </header>
    )
}

export default Header;