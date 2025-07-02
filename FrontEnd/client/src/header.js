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
            <button onClick={navigateMain}>Main</button>
            <button onClick={navigateAbout}>About</button>
            <button onClick={navigateTours}>Tours</button>
        </header>
    )
}

export default Header;