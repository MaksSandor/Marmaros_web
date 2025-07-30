import React from "react";
import Header from "../headerImg/header";
import Location from "../location/location";
import Footer from "../footer/footer";
import style from "./style.module.css";
import marmar from "./img/marmaros.png"

function AboutPage() {
    
    return (
        <div>
            <Header />
            <Location currentPage="Про нас" />

            <div className={style.about}>
                <img src={marmar}/>
                <div className={style.fristP}>                  
                    <p style={{fontSize: "18px"}}>
                        Товариство з обмеженою відповідальністю</p>

                    <p style={{fontSize: "18px", letterSpacing: "2px"}}>
                        “ТУРИСТИЧНО-ТРАНСПОРТНА КОМПАНІЯ “МАРМАРОС”</p>

                    <p>Організація туристичних поїздок по Україні. Основні напрямки: Прикарпаття, Закарпаття, Львів, Кам’янець-Подільський, Чернівці.</p>

                   <p>Пасажирські перевезення по Україні та за кордон.</p>

                    <p>Прямі відправлення по наших турах здійснюємо з наступних міст:</p>

                    <p>Новоград-Волинський, Рівне, Дубно, Нетішин, Острог, Кременець, Тернопіль, Радивилів, Броди, Львів, Стрий, Івано-Франківськ</p>

                    <p>Також організовуємо додаткові відправлення з наступних міст:</p>

                    <p>Дніпро, Кривий Ріг, Запоріжжя, Знам’янка, Кропивницький, Біла Церква, Корсунь, Київ, Житомир, Вінниця, Хмельницький, Миколаїів, Одеса.</p>
                </div>
                <div className={style.secondP}>
                    <p>м.Рівне, вул.Шкільна, 2, (2-й поверх)</p>

                    <p>моб.тел.   066-021-13-84</p>

                    <p>моб., viber, whats app:   068-741-41-93</p>

                    <p>e-mail: marmarosrv@ukr.net</p>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default AboutPage;