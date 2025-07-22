import React from "react";
import Header from "../headerImg/header";
import style from "./style.module.css"
import btn_img from "./img/btn.png"
import { useNavigate } from "react-router-dom";
import trophy from "./img/trophy.png";
import paper from "./img/paper.png";
import glass from "./img/magnifying-glass.png";
import hand from "./img/handshake.png";
import call from "./img/call-center.png";
import avatar from "./img/avatar.png";

function MainPage() {
    const navigate = useNavigate();
    
    return (
        <div>
            <Header />
            <div className={style.main_logo}>
                <div className={style.main_logo_txt}>
                    <h1>КАРПАТИ</h1>
                    <h2>ГОСТИНО ЗАПРОШУЮТЬ<br/> НА ВІДПОЧИНОК</h2>
                    <div className={style.main_logo_btn} onClick={() => navigate('/tours')}>
                        <img src={btn_img}/>
                        <p>БРОНЮВАТИ</p>
                    </div>
                </div>
                <p className={style.marmar}>marmar.com.ua</p>
            </div>
            
            <div className={style.main}>
                <div className={style.head_inf}>
                    <p>Тури в Карпати, Закарпаття, поїздки в Карпати, Закарпаття, Карпати, Закарпаття, Лижній тури, Новорічні тури, Мармарос</p>
                </div>


                
                <div className={style.WhyWeAre}>
                    <h1 className={style.whyWe_txt}>ЧОМУ МИ?</h1>
                    <div className={style.whyWe_options}>
                        <div className={style.describe_part}>
                            <div>
                                <img src={glass}/>
                                <h1>Безпека туристів</h1>
                            </div>
                            <p>Кожна особа під час туру застрахована від нещасних випадків на транспорті під час туру.</p>
                        </div>
                        <div className={style.describe_part}>
                            <div>
                                <img src={call}/>
                                <h1>Індивідуальний підхід</h1>
                            </div>
                            <p>Обговорюємо і підбираємо тур та умови відпочинку з кожний туристом. Враховуємо всі його побажання.</p>
                        </div>
                        <div className={style.describe_part}>
                            <div>
                                <img src={hand}/>
                                <h1>Програма лояльності</h1>
                            </div>
                            <p>Практикується система знижок для постійних клієнтів, дітей, 2 Місця для ветеранів АТО безкоштовно.</p>
                        </div>
                        <div className={style.describe_part}>
                            <div>
                                <img src={paper}/>
                                <h1>Безперервний сезон</h1>
                            </div>
                            <p>Кожного тижня протягом року Ви можете відпочити у наших турах незалежно від пори року.</p>
                        </div>
                        <div className={style.describe_part}>
                            <div>
                                <img src={avatar}/>
                                <h1>Комфорт і Якість</h1>
                            </div>
                            <p>З кожним днем наша команда забезпечує екскурсійні тури все кращими умовами.</p>
                        </div>
                        <div className={style.describe_part}>
                            <div>
                                <img src={trophy}/>
                                <h1>Єднаємо країну</h1>
                            </div>
                            <p>З 2017 року наша команда запровадила організацію відправлень в Карпати майже зі всіх регіонів.</p>
                        </div>
                    </div>
                </div>

                
            </div>

        </div>
    )
}

export default MainPage;