// src/AboutPage/AboutPage.js
import React from "react";
import Header from "../headerImg/header";
import Location from "../location/location";
import Footer from "../footer/footer";
import s from "./style.module.css";
import marmar from "./img/marmaros.png";
import {
  FaShieldAlt,
  FaBus,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaFacebookF,
  FaUsers,
  FaClock,
  FaStar,
} from "react-icons/fa";

const MAIN_CITIES = [
  "Новоград-Волинський","Рівне","Дубно","Нетішин","Острог","Кременець",
  "Тернопіль","Радивилів","Броди","Львів","Стрий","Івано-Франківськ",
];

const EXTRA_CITIES = [
  "Дніпро","Кривий Ріг","Запоріжжя","Знам’янка","Кропивницький","Біла Церква",
  "Корсунь","Київ","Житомир","Вінниця","Хмельницький","Миколаїв","Одеса",
];

export default function AboutPage() {
  return (
    <div className={s.page}>
      <Header />
      <Location currentPage="Про нас" />

      {/* HERO */}
      <section className={s.hero}>
        <div className={s.heroCard}>
          <img src={marmar} alt="Мармарос" className={s.logo} />
          <div className={s.heroText}>
            <h1>Туристично-транспортна компанія «Мармарос»</h1>
            <p>
              Організовуємо подорожі Україною: Прикарпаття, Закарпаття, Львів,
              Кам’янець-Подільський, Чернівці. Також надаємо пасажирські перевезення
              по Україні та за кордон.
            </p>
            <div className={s.heroBadges}>
              <span className={s.chip}><FaShieldAlt /> Страхування мандрівників</span>
              <span className={s.chip}><FaBus /> Комфортний транспорт</span>
              <span className={s.chip}><FaUsers /> Програма лояльності</span>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className={s.stats}>
        <div className={s.statItem}>
          <FaClock />
          <div><strong>З 2017 року</strong><span>досвід організації турів</span></div>
        </div>
        <div className={s.statItem}>
          <FaUsers />
          <div><strong>2 безкоштовні місця</strong><span>для ветеранів АТО</span></div>
        </div>
        <div className={s.statItem}>
          <FaStar />
          <div><strong>Щотижневі виїзди</strong><span>цілий рік</span></div>
        </div>
      </section>

      {/* CITIES */}
      <section className={s.card}>
        <h2><FaMapMarkerAlt /> Прямі відправлення</h2>
        <p className={s.note}>Постійні міста виїзду на наші тури:</p>
        <div className={s.chipsWrap}>
          {MAIN_CITIES.map((c) => (
            <span key={c} className={`${s.city} ${s.cityMain}`}>{c}</span>
          ))}
        </div>

        <h3 className={s.subhead}>Додаткові відправлення</h3>
        <div className={s.chipsWrap}>
          {EXTRA_CITIES.map((c) => (
            <span key={c} className={s.city}>{c}</span>
          ))}
        </div>
      </section>

      {/* WHAT WE DO / WHY US */}
      <section className={s.grid2}>
        <div className={s.card}>
          <h2>Що ми пропонуємо</h2>
          <ul className={s.list}>
            <li>Екскурсійні, гірськолижні, святкові та SPA-тури;</li>
            <li>Відпочинок для сімей, компаній і корпоративів;</li>
            <li>Гнучкі дати, індивідуальний підбір умов;</li>
            <li>Супровід координатора та інформаційна підтримка.</li>
          </ul>
        </div>
        <div className={s.card}>
          <h2>Чому саме ми</h2>
          <ul className={s.list}>
            <li>Прозорі умови та зрозумілі програми;</li>
            <li>Постійні знижки дітям і військовим;</li>
            <li>Комфортні готелі, перевірені партнери;</li>
            <li>Щотижневі виїзди впродовж року.</li>
          </ul>
        </div>
      </section>

      {/* CONTACTS */}
      <section className={s.contactCard}>
        <div className={s.contactLeft}>
          <h2>Контакти</h2>
          <p className={s.addr}>м. Рівне, вул. Шкільна, 2 (2-й поверх)</p>
          <div className={s.contacts}>
            <a href="tel:+380660211384" className={s.cta}><FaPhoneAlt /> 066-021-13-84</a>
            <a href="tel:+380687414193" className={s.cta}><FaPhoneAlt /> 068-741-41-93</a>
            <a href="mailto:marmarosrv@ukr.net" className={s.cta}><FaEnvelope /> marmarosrv@ukr.net</a>
            <a href="https://www.facebook.com/oleksandr.marmaros/" target="_blank" rel="noreferrer" className={s.cta}>
              <FaFacebookF /> Facebook
            </a>
          </div>
        </div>
        <div className={s.contactRight}>
          {/* Сюди можна вставити iframe Google Maps */}
          <div className={s.mapStub}>
            <FaMapMarkerAlt />
            <span>Тут може бути інтерактивна карта офісу</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
