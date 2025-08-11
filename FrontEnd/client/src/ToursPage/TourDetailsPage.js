// TourDetailsPage.js
import React, { useMemo, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useTourCards from "./useTourCards";
import Header from "../headerImg/header";
import Location from "../location/location";
import Footer from "../footer/footer";
import s from "./tour_details_style.module.css";
import BookingMenu from "./BookingMenu";
import {
  FaTag,
  FaUsers,
  FaBed,
  FaMapMarkerAlt,
  FaUtensils,
  FaCalendarAlt,
} from "react-icons/fa";

const withBase = (p) =>
  !p ? "" : p.startsWith("http") ? p : `http://localhost:3001${p}`;

function parseAboutToSections(aboutRaw = "") {
  const lines = String(aboutRaw || "").trim().split(/\r?\n/);
  const out = [];
  let cur = null;
  for (const ln of lines) {
    const h = ln.match(/^##\s+(.*)$/);
    const hr = ln.trim() === "---";
    if (h) {
      if (cur) out.push(cur);
      cur = { title: h[1].trim(), buf: [] };
    } else if (!hr) {
      if (!cur) cur = { title: "Опис", buf: [] };
      cur.buf.push(ln);
    }
  }
  if (cur) out.push(cur);
  return out
    .map((x) => ({ title: x.title, text: x.buf.join("\n").trim() }))
    .filter((x) => x.text);
}

// дістати id поточного користувача з localStorage (підтримує обидва формати)
function getCurrentUserId() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?._id || parsed?.user?._id || parsed?.id || null;
  } catch {
    return null;
  }
}

export default function TourDetailsPage() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const { name } = useParams();
  const tours = useTourCards();
  const tour = useMemo(() => tours.find((t) => t.name === name), [tours, name]);

  // ===== Коментарі =====
  const [comments, setComments] = useState([]);
  const [cLoading, setCLoading] = useState(true);
  const [cText, setCText] = useState("");
  const userId = useMemo(() => getCurrentUserId(), []);

  useEffect(() => {
    let active = true;
    async function loadComments() {
      if (!tour) return;
      setCLoading(true);
      try {
        // очікуваний бекенд: GET /api/comments/tour/:name -> масив коментарів
        const res = await fetch(
          `http://localhost:3001/api/comments/tour/${encodeURIComponent(
            tour.name
          )}`
        );
        if (res.ok) {
          const data = await res.json();
          if (active) setComments(Array.isArray(data) ? data : []);
        } else {
          if (active) setComments([]);
        }
      } catch {
        if (active) setComments([]);
      } finally {
        if (active) setCLoading(false);
      }
    }
    loadComments();
    return () => {
      active = false;
    };
  }, [tour]);

  async function submitComment(e) {
    e?.preventDefault?.();
    if (!tour) return;
    if (!userId) {
      alert("Спершу увійдіть в акаунт, щоб лишити коментар.");
      return;
    }
    const text = cText.trim();
    if (!text) return;

    try {
      // очікуваний бекенд: POST /api/comments  body: { text, author, tour }
      const res = await fetch("http://localhost:3001/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          author: userId,
          tour: tour._id, // має бути у відповіді /tours (Mongo _id)
        }),
      });
      if (res.ok) {
        const created = await res.json();
        setComments((prev) => [...prev, created]);
        setCText("");
      } else {
        alert("Не вдалося додати коментар.");
      }
    } catch {
      alert("Помилка мережі під час додавання коментаря.");
    }
  }

  if (!tour) {
    return (
      <div>
        <Header />
        <Location currentPage={`Тури / ${name || "..."}`} />
        <div style={{ padding: 40, textAlign: "center" }}>Тур не знайдено</div>
        <Footer />
      </div>
    );
  }

  const imgSrc = tour.img; // уже абсолютний з useTourCards
  const videoSrc = withBase(tour.mp4); // робимо абсолютним
  const gallery = Array.isArray(tour.Gallery)
    ? tour.Gallery.map(withBase)
    : [];

  const discount =
    tour.old_price && tour.old_price > tour.price
      ? Math.round(((tour.old_price - tour.price) / tour.old_price) * 100)
      : 0;

  const sections = parseAboutToSections(tour.about);

  // прогрес доступності
  const free = Number(tour.freePlaces || 0);
  const max = Number(tour.maxPlaces || 0);
  const taken = Math.max(0, max - free);
  const fill =
    max > 0 ? Math.min(100, Math.round((taken / max) * 100)) : 0;

  return (
    <div className={s.container}>
      <Header />
      <Location currentPage={`Тури / ${tour.name}`} />
      <div className={s.background} />
      <div className={s.secondBG} />

      <div className={s.inContainer}>
        {/* HERO */}
        <div className={s.hero}>
          <h1 className={s.title}>{tour.name}</h1>

          <div className={s.badges}>
            {tour.new && (
              <span className={`${s.chip} ${s.chipNew}`}>NEW</span>
            )}
            {tour.special && (
              <span className={s.chip}>
                <FaTag />
                &nbsp;{tour.special}
              </span>
            )}
            {discount > 0 && (
              <span className={`${s.chip} ${s.chipSale}`}>
                -{discount}%
              </span>
            )}
          </div>

          {/* ціна + місця */}
          <div className={s.priceBox}>
            <div className={s.priceSide}>
              <div className={s.priceMain}>{tour.price} грн</div>
              {tour.old_price ? (
                <div className={s.priceOld}>{tour.old_price} грн</div>
              ) : null}
            </div>

            <div className={s.avail}>
              <div className={s.labelRow}>
                <span className={s.availLabel}>
                  <FaUsers /> Вільно: {free}{" "}
                </span>
                {max ? <span className={s.availMax}> із {max}</span> : null}
              </div>
              <div className={s.bar}>
                <div
                  className={s.barFill}
                  style={{ width: `${fill}%` }}
                />
              </div>
            </div>
          </div>

          <button
            className={s.bookBtnTop}
            onClick={() => setBookingOpen(true)}
          >
            Забронювати
          </button>

          {/* meta-рядок */}
          <div className={s.metaGrid}>
            {tour.date?.firstDay && tour.date?.lastDay && (
              <div className={s.metaItem}>
                <FaCalendarAlt />
                <span>
                  {tour.date.firstDay} — {tour.date.lastDay}
                  {tour.date?.countDays
                    ? ` • ${tour.date.countDays} дн.`
                    : ""}
                </span>
              </div>
            )}
            {tour.locate && (
              <div className={s.metaItem}>
                <FaMapMarkerAlt />
                <span>{tour.locate}</span>
              </div>
            )}
            {tour.Hotel && (
              <div className={s.metaItem}>
                <FaBed />
                <span>{tour.Hotel}</span>
              </div>
            )}
            {tour.food && (
              <div className={s.metaItem}>
                <FaUtensils />
                <span>{tour.food}</span>
              </div>
            )}
          </div>
        </div>

        {/* МЕДІА */}
        <div className={s.mediaGrid}>
          {videoSrc && (
            <div className={s.mediaItem}>
              <video
                className={s.video}
                controls
                playsInline
                poster={imgSrc || undefined}
              >
                <source src={videoSrc} type="video/mp4" />
              </video>
            </div>
          )}
          {imgSrc && (
            <div className={s.mediaItem}>
              <img className={s.image} src={imgSrc} alt={tour.name} />
            </div>
          )}
        </div>

        {/* СЕКЦІЇ з about */}
        {sections.map((sec, i) => (
          <section key={i} className={s.card}>
            <h2>{sec.title}</h2>
            <p className={s.cardText}>{sec.text}</p>
          </section>
        ))}

        {/* поля зі схеми, якщо не ввійшли в about */}
        {tour.startPlace && (
          <section className={s.card}>
            <h2>🚍 Місце старту</h2>
            <p className={s.cardText}>{tour.startPlace}</p>
          </section>
        )}
        {tour.addedPay && (
          <section className={s.card}>
            <h2>💵 Додаткова оплата</h2>
            <p className={s.cardText}>{tour.addedPay}</p>
          </section>
        )}
        {tour.anotherInf && (
          <section className={s.card}>
            <h2>ℹ Інше</h2>
            <p className={s.cardText}>{tour.anotherInf}</p>
          </section>
        )}

        {/* ГАЛЕРЕЯ */}
        {gallery.length > 0 && (
          <div className={s.gallery}>
            {gallery.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`${tour.name} — фото ${i + 1}`}
                className={s.galleryImage}
                loading="lazy"
              />
            ))}
          </div>
        )}

        {/* КОМЕНТАРІ */}
        <section className={s.card}>
          <h2 style={{ marginBottom: 10 }}>Коментарі</h2>

          {/* список */}
          <div style={{ display: "grid", gap: 10, marginBottom: 12 }}>
            {cLoading ? (
              <div style={{ opacity: 0.8 }}>Завантаження…</div>
            ) : comments.length === 0 ? (
              <div style={{ opacity: 0.8 }}>
                Ще немає коментарів. Будьте першим!
              </div>
            ) : (
              comments.map((c) => {
                const authorName =
                  c?.author?.username ||
                  c?.author?.PIB ||
                  c?.author?.gmail ||
                  "Користувач";
                const dt = c?.createdAt
                  ? new Date(c.createdAt).toLocaleString("uk-UA")
                  : "";
                return (
                  <div
                    key={c._id || `${c.text}-${dt}`}
                    style={{
                      background: "rgba(255,255,255,0.9)",
                      borderRadius: 10,
                      padding: "10px 12px",
                      boxShadow: "0 6px 14px rgba(0,0,0,.06)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 8,
                        marginBottom: 6,
                        fontWeight: 700,
                      }}
                    >
                      <span>{authorName}</span>
                      <span style={{ opacity: 0.6, fontWeight: 500 }}>
                        {dt}
                      </span>
                    </div>
                    <div style={{ whiteSpace: "pre-line", lineHeight: 1.5 }}>
                      {c.text}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* форма */}
          <form onSubmit={submitComment} style={{ display: "grid", gap: 10 }}>
            <textarea
              value={cText}
              onChange={(e) => setCText(e.target.value)}
              placeholder={
                userId
                  ? "Напишіть свій коментар…"
                  : "Увійдіть, щоб залишити коментар"
              }
              disabled={!userId}
              style={{
                resize: "vertical",
                minHeight: 70,
                padding: 10,
                borderRadius: 10,
                border: "1px solid rgba(0,0,0,.12)",
                outline: "none",
                fontFamily: "inherit",
                fontSize: 15,
              }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="submit"
                disabled={!userId || !cText.trim()}
                className={s.bookBtn} // використовуємо стиль кнопок із сторінки
                style={{
                  all: "unset",
                  background:
                    "linear-gradient(90deg,#ff8a00,#e52e71)",
                  color: "#fff",
                  padding: "10px 18px",
                  fontSize: 16,
                  borderRadius: 999,
                  cursor: userId && cText.trim() ? "pointer" : "not-allowed",
                  boxShadow: "0 10px 24px rgba(229,46,113,.35)",
                }}
              >
                Додати коментар
              </button>
            </div>
          </form>
        </section>
      </div>

      {/* мобільний/стикі CTA */}
      <div className={s.stickyCta}>
        <div className={s.stickyPrice}>{tour.price} грн</div>
        <a href="tel:+380688600680" className={s.stickyBtn}>
          Бронювати
        </a>
      </div>

      <BookingMenu
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        tour={tour}
        // layout={{ rows: 11, cols: 4, aisleAfterCol: 1 }} // можеш задати свій макет
      />
      <Footer />
    </div>
  );
}
