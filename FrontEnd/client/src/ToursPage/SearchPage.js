// src/SearchPage/SearchPage.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import Header from "../headerImg/header";
import Location from "../location/location";
import Footer from "../footer/footer";
import useTourCards from "../ToursPage/useTourCards";
import { useNavigate } from "react-router-dom";
import s from "./search_style.module.css";

const SPECIALS = [
  { key: "5days", label: "5 днів" },
  { key: "excursion", label: "Екскурсійні" },
  { key: "ski", label: "Лижні" },
  { key: "newYear", label: "Новорічні" },
  { key: "festive", label: "Святкові" },
];

const currency = (n) => `${Number(n || 0).toLocaleString("uk-UA")} грн`;

// допоміжна картка в тому ж стилі, що й на головній/каруселі
function TourCard({ tour, onClick }) {
  const hasSale =
    Number(tour.old_price) > 0 && Number(tour.old_price) > Number(tour.price);
  const salePct = hasSale
    ? Math.round(((tour.old_price - tour.price) / tour.old_price) * 100)
    : 0;

  return (
    <div className={s.card} onClick={onClick} role="button" tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick()}>
      <div className={s.cardMedia} style={{ backgroundImage: `url(${tour.img})` }} />
      <div className={s.cardShade} />
      <div className={s.cardBody}>
        <div className={s.cardTopLine}>
          {tour.new && <span className={`${s.chip} ${s.chipNew}`}>NEW</span>}
          {hasSale && <span className={`${s.chip} ${s.chipSale}`}>-{salePct}%</span>}
          {tour.special && (
            <span className={s.chip}>{SPECIALS.find(x=>x.key===tour.special)?.label || tour.special}</span>
          )}
        </div>
        <h3 className={s.cardTitle}>{tour.name}</h3>
        <div className={s.cardPriceRow}>
          <span className={s.priceNow}>{currency(tour.price)}</span>
          {hasSale && <span className={s.priceOld}>{currency(tour.old_price)}</span>}
        </div>
        <div className={s.cardMeta}>
          {typeof tour.freePlaces === "number" && (
            <span className={tour.freePlaces > 0 ? s.badgeOk : s.badgeWarn}>
              Вільних: {tour.freePlaces}
            </span>
          )}
          {tour.date?.countDays ? <span className={s.badge}>{tour.date.countDays} дн.</span> : null}
          {tour.locate ? <span className={s.badge}>{tour.locate}</span> : null}
        </div>
      </div>
    </div>
  );
}

export default function Search() {
  const tours = useTourCards();
  const nav = useNavigate();

  // -------- фільтри
  const [q, setQ] = useState("");
  const [specials, setSpecials] = useState([]); // масив ключів
  const [onlyNew, setOnlyNew] = useState(false);
  const [onlyDiscount, setOnlyDiscount] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);

  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(100000);

  const [sort, setSort] = useState("relevance"); // relevance|priceAsc|priceDesc|freeDesc|newFirst

  // ініціалізуємо межі ціни, коли приходять тури
  useEffect(() => {
    if (!tours.length) return;
    const prices = tours.map((t) => Number(t.price || 0));
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    setPriceMin(min);
    setPriceMax(max);
  }, [tours]);

  // дебаунс пошуку
  const [qDebounced, setQDebounced] = useState("");
  const qRef = useRef(null);
  useEffect(() => {
    const t = setTimeout(() => setQDebounced(q.trim().toLowerCase()), 250);
    return () => clearTimeout(t);
  }, [q]);

  // перемикачі категорій
  const toggleSpecial = (key) => {
    setSpecials((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // застосування фільтрів
  const filtered = useMemo(() => {
    let list = tours.slice();

    // текстовий пошук по назві та about
    if (qDebounced) {
      list = list.filter((t) => {
        const name = String(t.name || "").toLowerCase();
        const about = String(t.about || "").toLowerCase();
        return name.includes(qDebounced) || about.includes(qDebounced);
      });
    }

    // категорії
    if (specials.length) {
      list = list.filter((t) => specials.includes(t.special));
    }

    // new
    if (onlyNew) list = list.filter((t) => !!t.new);

    // знижка
    if (onlyDiscount)
      list = list.filter(
        (t) => Number(t.old_price) > 0 && Number(t.old_price) > Number(t.price)
      );

    // наявність
    if (onlyInStock) list = list.filter((t) => Number(t.freePlaces) > 0);

    // ціна
    list = list.filter((t) => {
      const p = Number(t.price || 0);
      return p >= priceMin && p <= priceMax;
    });

    // сортування
    switch (sort) {
      case "priceAsc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "freeDesc":
        list.sort((a, b) => (b.freePlaces || 0) - (a.freePlaces || 0));
        break;
      case "newFirst":
        list.sort((a, b) => Number(b.new) - Number(a.new));
        break;
      default:
        // relevance: простий буст назви + спецкатегорій
        list.sort((a, b) => {
          const score = (t) => {
            let s = 0;
            if (qDebounced) {
              const name = String(t.name || "").toLowerCase();
              if (name.startsWith(qDebounced)) s += 3;
              else if (name.includes(qDebounced)) s += 2;
              const about = String(t.about || "").toLowerCase();
              if (about.includes(qDebounced)) s += 1;
            }
            if (specials.length && specials.includes(t.special)) s += 1;
            if (onlyDiscount && Number(t.old_price) > Number(t.price)) s += 1;
            if (onlyNew && t.new) s += 1;
            return -s; // менший кращий (для sort)
          };
          return score(a) - score(b);
        });
    }

    return list;
  }, [
    tours,
    qDebounced,
    specials,
    onlyNew,
    onlyDiscount,
    onlyInStock,
    priceMin,
    priceMax,
    sort,
  ]);

  // для красоти – показуємо межі ціни праворуч
  const minTotal = useMemo(() => {
    if (!tours.length) return 0;
    return Math.min(...tours.map((t) => Number(t.price || 0)));
  }, [tours]);
  const maxTotal = useMemo(() => {
    if (!tours.length) return 0;
    return Math.max(...tours.map((t) => Number(t.price || 0)));
  }, [tours]);

  return (
    <div className={s.page}>
      <Header />
      <Location currentPage="Пошук турів" />

      <div className={s.container}>
        {/* ПАНЕЛЬ ФІЛЬТРІВ */}
        <div className={s.filters}>
          <div className={s.searchRow}>
            <input
              ref={qRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className={s.searchInput}
              placeholder="Пошук за назвою або описом…"
            />
            <select
              className={s.sort}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Сортування"
            >
              <option value="relevance">За релевантністю</option>
              <option value="priceAsc">Ціна: зростання</option>
              <option value="priceDesc">Ціна: спадання</option>
              <option value="freeDesc">Наявність місць</option>
              <option value="newFirst">Спочатку нові</option>
            </select>
          </div>

          <div className={s.rowChips}>
            {SPECIALS.map((sp) => (
              <button
                key={sp.key}
                onClick={() => toggleSpecial(sp.key)}
                className={`${s.chipCtl} ${
                  specials.includes(sp.key) ? s.chipCtlActive : ""
                }`}
                aria-pressed={specials.includes(sp.key)}
              >
                {sp.label}
              </button>
            ))}
          </div>

          <div className={s.rowSwitches}>
            <label className={s.switch}>
              <input
                type="checkbox"
                checked={onlyNew}
                onChange={(e) => setOnlyNew(e.target.checked)}
              />
              <span>Лише нові</span>
            </label>
            <label className={s.switch}>
              <input
                type="checkbox"
                checked={onlyDiscount}
                onChange={(e) => setOnlyDiscount(e.target.checked)}
              />
              <span>Зі знижкою</span>
            </label>
            <label className={s.switch}>
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
              />
              <span>Є місця</span>
            </label>
          </div>

          <div className={s.priceRow}>
            <div className={s.priceInputs}>
              <div className={s.priceBox}>
                <label>Мін.</label>
                <input
                  type="number"
                  value={priceMin}
                  min={minTotal}
                  max={priceMax}
                  onChange={(e) => setPriceMin(Number(e.target.value || 0))}
                />
              </div>
              <div className={s.priceBox}>
                <label>Макс.</label>
                <input
                  type="number"
                  value={priceMax}
                  min={priceMin}
                  max={maxTotal}
                  onChange={(e) => setPriceMax(Number(e.target.value || 0))}
                />
              </div>
            </div>
            <div className={s.priceNote}>
              Діапазон: {currency(minTotal)} — {currency(maxTotal)}
            </div>
          </div>
        </div>

        {/* РЕЗУЛЬТАТИ */}
        <div className={s.resultsHead}>
          Знайдено: <strong>{filtered.length}</strong>
        </div>

        {filtered.length === 0 ? (
          <div className={s.empty}>
            Нічого не знайдено. Спробуй змінити фільтри або пошукову фразу.
          </div>
        ) : (
          <div className={s.grid}>
            {filtered.map((t) => (
              <TourCard
                key={t.id || t._id || t.name}
                tour={t}
                onClick={() => nav(`/tours/${encodeURIComponent(t.name)}`)}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
