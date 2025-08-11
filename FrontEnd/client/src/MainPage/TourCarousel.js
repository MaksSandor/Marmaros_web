import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import style from "./TourCarousel.module.css";

const currency = (n) => `${Number(n || 0).toLocaleString("uk-UA")} грн`;

function TourCarousel({ tours }) {
  const navigate = useNavigate();
  const scrollerRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [step, setStep] = useState(280); // ширина картки + gap (переобчислю в useEffect)

  // Переобчислюємо крок прокрутки (ширина картки + column-gap) з реальних стилів
  const measureStep = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector(`.${style.card}`);
    const cardW = card ? card.getBoundingClientRect().width : 260;
    const gap = parseFloat(getComputedStyle(el).columnGap || "0") || 0;
    setStep(cardW + gap);
  }, []);

  const updateButtons = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    // невеличкий допуск на пікселі
    setCanPrev(scrollLeft > 2);
    setCanNext(scrollLeft + clientWidth < scrollWidth - 2);
  }, []);

  useEffect(() => {
    // перша ініціалізація
    measureStep();
    // дати браузеру домалювати
    const t = setTimeout(() => {
      measureStep();
      updateButtons();
    }, 0);
    const onResize = () => {
      measureStep();
      updateButtons();
    };
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
  }, [measureStep, updateButtons, tours?.length]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => updateButtons();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [updateButtons]);

  const scrollByCard = (dir = 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const goTour = (tour) => {
    // локальна навігація без зовнішнього onCardClick
    navigate(`/tours/${encodeURIComponent(tour.name)}`);
  };

  if (!tours || tours.length === 0) return null;

  return (
    <div className={style.carouselWrap}>
      <div className={style.navLayer}>
        <button
          className={`${style.navBtn} ${style.navPrev}`}
          onClick={() => scrollByCard(-1)}
          aria-label="Попередні тури"
          disabled={!canPrev}
        >
          ‹
        </button>
        <button
          className={`${style.navBtn} ${style.navNext}`}
          onClick={() => scrollByCard(1)}
          aria-label="Наступні тури"
          disabled={!canNext}
        >
          ›
        </button>
      </div>

      <div className={style.carousel} ref={scrollerRef}>
        {tours.map((tour) => {
          const hasSale =
            Number(tour.old_price) > 0 && Number(tour.old_price) > Number(tour.price);
          const salePct = hasSale
            ? Math.round(((tour.old_price - tour.price) / tour.old_price) * 100)
            : 0;

          return (
            <div
              key={tour.id || tour._id || tour.name}
              className={style.card}
              onClick={() => goTour(tour)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") goTour(tour);
              }}
            >
              <div
                className={style.cardMedia}
                style={{ backgroundImage: `url(${tour.img})` }}
              />
              <div className={style.cardShade} />
              <div className={style.cardBody}>
                <div className={style.cardTopLine}>
                  {hasSale && (
                    <span className={`${style.chip} ${style.chipSale}`}>
                      -{salePct}%
                    </span>
                  )}
                </div>
                <h3 className={style.cardTitle}>{tour.name}</h3>
                <div className={style.cardPriceRow}>
                  <span className={style.priceNow}>{currency(tour.price)}</span>
                  {hasSale && (
                    <span className={style.priceOld}>
                      {currency(tour.old_price)}
                    </span>
                  )}
                </div>
                <div className={style.cardMeta}>
                  <span>Вільних: {tour.freePlaces ?? "-"}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TourCarousel;
