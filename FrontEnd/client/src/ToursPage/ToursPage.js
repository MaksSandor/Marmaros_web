import React, { useMemo } from "react";
import Header from "../headerImg/header";
import useTourCards from "./useTourCards";
import style_cards from "./cards_style.module.css";
import style_page from "./page_style.module.css";
import { useNavigate } from "react-router-dom";
import Footer from "../footer/footer";
import Location from "../location/location";

function TourPage() {
  const tours = useTourCards();
  const navigate = useNavigate();

  const cards = useMemo(() => {
    return tours.map((t) => {
      const hasDiscount = t.old_price && t.old_price > t.price;
      const discountPct = hasDiscount
        ? Math.round(((t.old_price - t.price) / t.old_price) * 100)
        : 0;
      const free = Number(t.freePlaces || 0);
      const max = Number(t.maxPlaces || 0);
      const taken = Math.max(0, max - free);
      const fill = max > 0 ? Math.min(100, Math.round((taken / max) * 100)) : 0;
      return { ...t, hasDiscount, discountPct, free, max, fill };
    });
  }, [tours]);

  return (
    <div className={style_page.page}>
      <Header />
      <Location currentPage="Тури" />
      <div className={style_page.background}></div>
      <div className={style_cards.second_bg}></div>

      <div className={style_cards.cards_place}>
        {cards.map((tour) => (
          <div
            key={tour.id}
            className={style_cards.card}
            onClick={() => navigate(`/tours/${tour.name}`)}
          >
            {/* Відео на фоні */}
            {tour.mp4 && (
              <video
                autoPlay
                muted
                loop
                playsInline
                className={style_cards.backgroundVideo}
              >
                <source
                  src={`http://localhost:3001${tour.mp4}`}
                  type="video/mp4"
                />
              </video>
            )}

            {/* Бейджі */}
            <div className={style_cards.badges}>
              {tour.new && (
                <span className={`${style_cards.chip} ${style_cards.chipNew}`}>
                  NEW
                </span>
              )}
              {tour.special && (
                <span className={style_cards.chip}>{tour.special}</span>
              )}
              {tour.hasDiscount && (
                <span
                  className={`${style_cards.chip} ${style_cards.chipSale}`}
                >
                  -{tour.discountPct}%
                </span>
              )}
            </div>

            {/* Контент картки */}
            <div className={style_cards.cardContent}>
              <div className={style_cards.contentPanel}>
                <img
                  src={tour.img}
                  alt={tour.name}
                  className={style_cards.img}
                />
                <h1 className={style_cards.title}>{tour.name}</h1>

                <div className={style_cards.places}>
                  <p className={style_cards.free}>
                    Вільно: <span>{tour.freePlaces}</span>
                    {tour.max ? ` / ${tour.max}` : ""}
                  </p>
                  <div className={style_cards.barMini}>
                    <div
                      className={style_cards.barMiniFill}
                      style={{ width: `${tour.fill}%` }}
                    />
                  </div>
                </div>

                <div className={style_cards.priceRow}>
                  <span className={style_cards.priceNow}>
                    {tour.price} грн
                  </span>
                  {tour.old_price ? (
                    <span className={style_cards.priceOld}>
                      {tour.old_price} грн
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}

export default TourPage;
