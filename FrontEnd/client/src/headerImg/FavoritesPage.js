// src/FavoritesPage/FavoritesPage.js
import React, { useMemo } from "react";
import Header from "../headerImg/header";
import Location from "../location/location";
import Footer from "../footer/footer";
import useTourCards from "../ToursPage/useTourCards";
import { getFavs, toggleFav, isFav } from "../utils/favorites";
import s from "./favorites_style.module.css";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

const currency = (n) => `${Number(n || 0).toLocaleString("uk-UA")} грн`;

export default function FavoritesPage() {
  const tours = useTourCards();
  const nav = useNavigate();
  const favKeys = getFavs();

  const favTours = useMemo(() => {
    // ключ може бути id, _id або name — перевіримо все
    const set = new Set(favKeys.map(String));
    return tours.filter((t) =>
      set.has(String(t.id)) || set.has(String(t._id)) || set.has(String(t.name))
    );
  }, [tours, favKeys]);

  const onToggleFav = (tour) => {
    const key = tour.id || tour._id || tour.name;
    toggleFav(key);
  };

  return (
    <div className={s.page}>
      <Header />
      <Location currentPage="Улюблені тури" />

      <div className={s.container}>
        {favTours.length === 0 ? (
          <div className={s.empty}>
            Немає улюблених турів. Додай будь-який тур, натиснувши на ❤️ .
          </div>
        ) : (
          <div className={s.grid}>
            {favTours.map((t) => (
              <article key={t.id || t._id || t.name} className={s.card}>
                <div
                  className={s.cardMedia}
                  style={{ backgroundImage: `url(${t.img})` }}
                  onClick={() => nav(`/tours/${encodeURIComponent(t.name)}`)}
                  role="button"
                />
                <div className={s.cardShade} />
                <div className={s.cardBody}>
                  <h3 className={s.cardTitle}>{t.name}</h3>
                  <div className={s.cardPriceRow}>
                    <span className={s.priceNow}>{currency(t.price)}</span>
                    {Number(t.old_price) > Number(t.price) && (
                      <span className={s.priceOld}>{currency(t.old_price)}</span>
                    )}
                  </div>
                  <button
                    className={`${s.favToggle} ${isFav(t.id || t._id || t.name) ? s.favOn : ""}`}
                    onClick={() => onToggleFav(t)}
                    title="Улюблене"
                  >
                    <FaHeart />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
