import React from "react";
import Header from "../headerImg/header";
import useTourCards from "./useTourCards"; 
import style_cards from "./cards_style.module.css";
import style_page from "./page_style.module.css";
import { useNavigate } from "react-router-dom";

function TourPage() {
  const tours = useTourCards();
  const navigate = useNavigate();



  return (
    <div className={style_page.page}>
      <Header />
      <div className={style_page.background}></div>
      <div className={style_cards.second_bg}></div>
      
      <div className={style_cards.cards_place}>
          {tours.map((tour) => (
                <div key={tour.id} className={style_cards.card} onClick={() => {navigate(`/tours/${tour.name}`)}}>
                    <video autoPlay muted loop playsInline className={style_cards.backgroundVideo} >
                      <source src={`http://localhost:3001${tour.mp4}`} type="video/mp4" />
                      Відео не завантажене.
                    </video>
                    <img src={tour.img} alt={tour.name} className={style_cards.img} />
                    <h1 className={style_cards.title}>{tour.name}</h1>
                    <div className={style_cards.places}>
                        <p className={style_cards.free}>Вільних місць: <span>{tour.freePlaces}</span></p>
                        <p className={style_cards.max}>Макс. місць: <span>{tour.maxPlaces}</span></p>
                    </div>  
                    <p className={style_cards.price}>Ціна: {tour.price} грн</p>
                </div>))}
      </div>
    </div>
  );
}

export default TourPage;
