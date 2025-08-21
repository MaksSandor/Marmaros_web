import React, { useEffect, useState } from 'react';
import header_style from './header_style.module.css';
import phoneLogo from "./phone.png";
import facebookLogo from "./facebook.png";
import heartLogo from "./heart.png";         // 🔁 заміна «корзини» на сердечко (додай файл)
import searchLogo from "./search.png";
import marmarosLogo from "./marmaros.png";
import userLogo from "./user.png";
import { useNavigate, useLocation } from 'react-router-dom';
import { checkSignIn, SignInForm, RegisterForm, getPib } from "./accaunt";
import { countFavs } from "../utils/favorites";  // ✅

function Header() {
  const [loginForm, setLoginForm] = useState(false);
  const [regForm, setRegForm] = useState(false);
  const [favCount, setFavCount] = useState(0);   // ✅ лічильник улюблених

  const location = useLocation();
  const navigate = useNavigate();
  const pib = getPib();

  const useLogin = () => setLoginForm(v => !v);
  const useReg = () => setRegForm(v => !v);

  useEffect(() => { setRegForm(false); }, [loginForm]);
  useEffect(() => { setLoginForm(false); }, [regForm]);

  // оновлюємо лічильник при завантаженні/зміні вкладки/події storage
  useEffect(() => {
    const refresh = () => setFavCount(countFavs());
    refresh();
    const h = () => refresh();
    window.addEventListener("storage", h);
    return () => window.removeEventListener("storage", h);
  }, [location.pathname]);

  const navigateMain = () => navigate('/');
  const navigateAbout = () => navigate('/about');
  const navigateTours = () => navigate('/tours');

  // перехід на пошук уже з активним фільтром «лише улюблені»
  const navigateFavorites = () => navigate('/search?fav=1');

  return (
    <header>
      <div className={header_style.background}></div>

      <div className={header_style.top_block}>
        <div className={header_style.phone_block} onClick={() => window.open('tel:+380688600680')}>
          <img src={phoneLogo} alt="Phone logo"/>
          <p>(068)-860-06-80</p>
        </div>

        <div className={header_style.social_block}>
          <SignInForm isVisible={loginForm} />
          <RegisterForm isVisible={regForm} />

          {checkSignIn() ? (
            <img
              className={header_style.user_logo}
              src={userLogo}
              alt="Профіль"
              onClick={() => navigate(`/${pib}`)}
            />
          ) : (
            <>
              <button className={header_style.buttonSign} onClick={useLogin}>Увійти</button>
              <button className={header_style.buttonReg} onClick={useReg}>Зареєструватись</button>
            </>
          )}

          <img
            src={facebookLogo}
            alt="facebook"
            onClick={() => window.open("https://www.facebook.com/oleksandr.marmaros/", "_blank")}
          />

          {/* ❤️ Улюблені – замість корзини */}
          <div className={header_style.favWrap} onClick={navigateFavorites} title="Улюблені тури">
            <img src={heartLogo} alt="Улюблені"/>
          </div>

          <img src={searchLogo} alt="search" onClick={() => navigate('/search')}/>
        </div>
      </div>

      <div className={header_style.bottom_block}>
        <img
          src={marmarosLogo}
          alt="MarMaros"
          className={header_style.marmarlogo}
          onClick={() => navigate("/")}
        />

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
            className={`${header_style.About} ${header_style.aboutUsBtn} ${location.pathname === '/about' ? header_style.active : ''}`}
          >
            Про нас
          </button>

          <button
            onClick={() => {navigate("/gallery")}}
            className={`${header_style.Galery} ${location.pathname === '/galery' ? header_style.active : ''}`}
          >
            Галерея
          </button>

          <button
            onClick={() => {navigate("/news")}}
            className={`${header_style.News} ${location.pathname === '/news' ? header_style.active : ''}`}
          >
            Новини
          </button>

          <button
            onClick={() => {navigate("/contacts")}}
            className={`${header_style.Contacts} ${location.pathname === '/contacts' ? header_style.active : ''}`}
          >
            Контакти
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
