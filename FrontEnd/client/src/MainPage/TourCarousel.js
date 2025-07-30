// TourCarousel.js (оновлений)
import React, { useState } from "react";
import style from "./TourCarousel.module.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function TourCarousel({ tours }) {
  const [index, setIndex] = useState(0);
  const locate = useNavigate();

  const next = () => {
    if (index < tours.length - 4) setIndex(index + 1);
  };

  const prev = () => {
    if (index > 0) setIndex(index - 1);
  };

  return (
    <div className={style.carousel}>
      <h2 className={style.title}>🔥 Гарячі тури зі знижками</h2>
      <div className={style.sliderWrapper}>
        <button className={style.navBtn} onClick={prev}>
          <FaChevronLeft />
        </button>
        <div
          className={style.slider}
          style={{ transform: `translateX(-${index * 320}px)` }}
        >
          {tours.map((tour) => (
            <div key={tour.id} className={style.card}>
              <div className={style.image}>
                <img src={tour.img} alt={tour.name} />
                <div className={style.priceTag}>
                  <span className={style.oldPrice}>{tour.old_price}₴</span>
                  <span className={style.newPrice}>{tour.price}₴</span>
                </div>
              </div>
              <div className={style.content}>
                <h3>{tour.name}</h3>
                <p className={style.duration}>{tour.special}</p>
                <p className={style.description}>{tour.about.slice(0, 60)}...</p>
                <button
                  className={style.btn}
                  onClick={() => locate(`/tours/${tour.name}`)}
                >
                  Детальніше
                </button>
              </div>
            </div>
          ))}
        </div>
        <button className={style.navBtn} onClick={next}>
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
}

export default TourCarousel;
