import React from "react";
import Header from "../header";
import useTourCards from "./useTourCards"; 
import style_cards from "./cards_style.module.css";
import style_page from "./page_style.module.css";

function TourPage() {
  const tours = useTourCards();

  return (
    <div className={style_page.page}>
      <Header />
      <div className={style_cards.cards_place}>
          {tours.map((tour) => (
                <div key={tour.id} className={style_cards.card}>
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
