import React from "react";
import { useParams } from "react-router-dom";
import useTourCards from "./useTourCards";
import Header from "../headerImg/header";
import style from "./tour_details_style.module.css";
import Location from '../location/location';

function TourDetailsPage() {
  const { name } = useParams();
  const tours = useTourCards();

  const tour = tours.find(t => t.name === name);

  if (!tour) {
    return (
      <div>
        <Header />
        <h2>Тур не знайдено</h2>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <Location currentPage={`Тури / ${tour.name}`} />
      <div className={style.container}>
        <div className={style.background}></div>
        <div className={style.inContainer}>
            <div className={style.secondBG}></div>
            <h1 className={style.title}>{tour.name}</h1>
            <video autoPlay muted loop controls className={style.video}>
              <source src={`http://localhost:3001${tour.mp4}`} type="video/mp4" />
            </video>
            <img src={tour.img} alt={tour.name} className={style.image} />
            <p className={style.free}><strong>Вільних місць:</strong> {tour.freePlaces}</p>
            <p className={style.max}><strong>Макс. місць:</strong> {tour.maxPlaces}</p>
            <p className={style.price}><strong>Ціна:</strong> {tour.price} грн</p>
            <p className={style.disc}>{tour.about}</p>
        </div>
      </div>
    </div>
  );
}

export default TourDetailsPage;
