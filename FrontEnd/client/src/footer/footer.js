import React from 'react';
import style from './style.module.css';
import { FaChevronUp } from 'react-icons/fa';

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className={style.footer}>
      <div className={style.scrollTopBtn} onClick={scrollToTop}>
        <FaChevronUp />
      </div>
      <p>© МАРМАРОС 2021 Всі права захищено</p>
    </footer>
  );
}

export default Footer;
