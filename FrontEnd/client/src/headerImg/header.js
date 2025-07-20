import React, { useEffect } from 'react';
import header_style from './header_style.module.css'
import phoneLogo from "./phone.png"
import facebookLogo from "./facebook.png"
import shopLogo from "./shop.png"
import searchLogo from "./search.png"
import marmarosLogo from "./marmaros.png";
import userLogo from "./user.png";
import { useNavigate, useLocation } from 'react-router-dom';
import {checkSignIn, SignInForm, RegisterForm, getPib} from "./accaunt";
import { useState } from 'react';


function Header() {

    const [loginForm, setLoginForm] = useState(false);
    const [regForm, setRegForm] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const pib = getPib();

    const useLogin = () => {
      setLoginForm(!loginForm);
    }

    const useReg = () => {
      setRegForm(!regForm);
    }

    useEffect(() => {setRegForm(false)}, [loginForm]);
    useEffect(() => {setLoginForm(false)}, [regForm]);

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
          <div className={header_style.background}></div>
            <div className={header_style.top_block}>
                <div className={header_style.phone_block}>
                    <img src={phoneLogo}  alt="Phone logo"/>
                    <p>(068)-860-06-80</p>
                </div>
            

                <div className={header_style.social_block}>
                    <SignInForm isVisible={loginForm} />
                    <RegisterForm isVisible={regForm} />
                    {checkSignIn() ? (
                      <img className={header_style.user_logo} src={userLogo}  onClick={() => navigate(`/${pib}`)}/>
                    ) : (
                      <>
                        <button className={header_style.buttonSign} onClick={useLogin}>Увійти</button>
                        <button className={header_style.buttonReg} onClick={useReg}>Зареєструватись</button>
                      </>
                    )}

                    <img src={facebookLogo} alt="facebook"/>
                    <img src={shopLogo} alt="Shoping"/>
                    <img src={searchLogo} alt="search"/>
                </div>
            </div>


            <div className={header_style.bottom_block}>
                <img src={marmarosLogo} alt="MarMaros" className={header_style.marmarlogo}/>
                
                <div className={header_style.pages_block}>
                    <button
                      onClick={navigateMain}
                      className={`${header_style.Main} ${location.pathname === '/' ? header_style.active : ''}`}
                    >
                      Головна
                    </button>

                    <button
                      onClick={navigateTours}
                      className={`${header_style.Tours} ${location.pathname === '/tours' ? header_style.active : ''}`}
                    >
                      Тури
                    </button>

                    <button
                      onClick={navigateAbout}
                      className={`${header_style.About} ${location.pathname === '/about' ? header_style.active : ''}`}
                    >
                      Про нас
                    </button>

                    <button
                      onClick={navigateTours}
                      className={`${header_style.Galery} ${location.pathname === '/galery' ? header_style.active : ''}`}
                    >
                      Галерея
                    </button>

                    <button
                      onClick={navigateTours}
                      className={`${header_style.News} ${location.pathname === '/news' ? header_style.active : ''}`}
                    >
                      Новини
                    </button>

                    <button
                      onClick={navigateTours}
                      className={`${header_style.Contacts} ${location.pathname === '/contacts' ? header_style.active : ''}`}
                    >
                      Контакти
                    </button>
                </div>
            </div>            
        </header>
    )
}

export default Header;