import React, { useEffect, useMemo, useState } from "react";
import Header from "../headerImg/header";
import Location from "../location/location";
import Footer from "../footer/footer";
import s from "./news_style.module.css";
import { FaSearch, FaCalendarAlt, FaFolderOpen, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Якщо вже маєш бекенд — лишай, якщо ні: мок-дані спрацюють автоматично
const FALLBACK_NEWS = [
  {
    _id: "1",
    slug: "zimovi-tury-2025",
    title: "Зимові тури 2025 — відкрито продаж",
    excerpt: "Стартуємо з новими програмами: лижі, чан, термальні басейни, дегустації…",
    cover: "/uploads/news/winter.jpg",
    category: "Анонси",
    createdAt: "2025-01-05",
  },
  {
    _id: "2",
    slug: "dragobrat-trydenny",
    title: "Драгобрат: триденні заїзди щотижня",
    excerpt: "Оновлений трансфер, нові готелі, кращі траси та релакс у чанах.",
    cover: "/uploads/news/dragobrat.jpg",
    category: "Карпати",
    createdAt: "2025-01-02",
  },
  {
    _id: "3",
    slug: "shayan-spa-week",
    title: "SPA week у Шаяні — знижки до -15%",
    excerpt: "Оновили пакет: басейни, сауни, винні дегустації, йога-вихідні.",
    cover: "/uploads/news/shayan.jpg",
    category: "Закарпаття",
    createdAt: "2024-12-22",
  },
  {
    _id: "4",
    slug: "noviy-rik-karpaty",
    title: "Новорічні заїзди: програма та бронювання",
    excerpt: "Жива музика, святкова вечеря, купання у чанах та фотосесії.",
    cover: "/uploads/news/newyear.jpg",
    category: "Свята",
    createdAt: "2024-12-10",
  },
  {
    _id: "5",
    slug: "odesa-season",
    title: "Одеса: перший літній блок місць відкрито",
    excerpt: "Морський сезон — відповідь на головні питання та поради.",
    cover: "/uploads/news/odesa.jpg",
    category: "Море",
    createdAt: "2024-11-28",
  },
];

const withBase = (p) => (!p ? "" : p.startsWith("http") ? p : `http://localhost:3001${p}`);
const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("uk-UA", { year: "numeric", month: "long", day: "numeric" });

export default function NewsPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // фільтри
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Усі");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 6;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("http://localhost:3001/api/news");
        if (!res.ok) throw new Error("no api");
        const data = await res.json();
        if (!cancelled) {
          setItems(Array.isArray(data) ? data : FALLBACK_NEWS);
          setLoaded(true);
        }
      } catch {
        // fallback
        if (!cancelled) {
          setItems(FALLBACK_NEWS);
          setLoaded(true);
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // категорії з даних
  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category).filter(Boolean));
    return ["Усі", ...Array.from(set)];
  }, [items]);

  // пошук + фільтр
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return items.filter((n) => {
      const okCat = cat === "Усі" || n.category === cat;
      const okQ =
        !term ||
        n.title?.toLowerCase().includes(term) ||
        n.excerpt?.toLowerCase().includes(term);
      return okCat && okQ;
    });
  }, [items, q, cat]);

  // фічерна новина — перша свіжа
  const featured = filtered[0];

  // пагінація (без фічерної дубляції — показуємо зі 2-го)
  const gridItems = filtered.slice(1);
  const totalPages = Math.max(1, Math.ceil(gridItems.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = gridItems.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  useEffect(() => {
    // якщо фільтри змінились — повертаємося на 1 сторінку
    setPage(1);
  }, [q, cat]);

  const openPost = (post) => {
    // якщо робитимеш детальну сторінку:
    // navigate(`/news/${post.slug || post._id}`);
    // поки що просто скролл і алерт як заглушка
    navigate(0);
  };

  return (
    <div className={s.page}>
      <Header />
      <Location currentPage="Новини" />

      {/* HERO */}
      <section className={s.hero}>
        <div className={s.heroShade} />
        <div className={s.heroInner}>
          <h1 className={s.heroTitle}>Новини</h1>
          <p className={s.heroSub}>Анонси турів, знижки, корисні поради та розбори маршрутів.</p>

          {/* Пошук + фільтри-чіпси */}
          <div className={s.toolbar}>
            <div className={s.searchBox}>
              <FaSearch />
              <input
                className={s.searchInput}
                placeholder="Пошук за назвою чи описом…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <div className={s.chips}>
              {categories.map((c) => (
                <button
                  key={c}
                  className={`${s.chip} ${cat === c ? s.chipActive : ""}`}
                  onClick={() => setCat(c)}
                >
                  <FaFolderOpen />
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className={s.section}>
        {!loaded ? (
          <div className={s.skelFeatured} />
        ) : featured ? (
          <article
            className={s.featured}
            style={{ backgroundImage: `url(${withBase(featured.cover)})` }}
            onClick={() => openPost(featured)}
          >
            <div className={s.featuredShade} />
            <div className={s.featuredBody}>
              <div className={s.featuredMeta}>
                {featured.category && <span className={s.badge}>{featured.category}</span>}
                {featured.createdAt && (
                  <span className={s.metaItem}><FaCalendarAlt /> {formatDate(featured.createdAt)}</span>
                )}
              </div>
              <h2 className={s.featuredTitle}>{featured.title}</h2>
              {featured.excerpt && <p className={s.featuredExcerpt}>{featured.excerpt}</p>}
            </div>
          </article>
        ) : (
          <div className={s.empty}>За фільтрами нічого не знайдено.</div>
        )}
      </section>

      {/* GRID of cards */}
      <section className={s.section}>
        {!loaded ? (
          <div className={s.grid}>
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className={s.skelCard} />)}
          </div>
        ) : gridItems.length === 0 ? (
          <div className={s.empty}>Наразі новин немає.</div>
        ) : (
          <>
            <div className={s.grid}>
              {pageItems.map((n) => (
                <article key={n._id || n.slug} className={s.card} onClick={() => openPost(n)}>
                  <div
                    className={s.cardMedia}
                    style={{ backgroundImage: `url(${withBase(n.cover)})` }}
                  />
                  <div className={s.cardShade} />
                  <div className={s.cardBody}>
                    <div className={s.cardTop}>
                      {n.category && <span className={s.badge}>{n.category}</span>}
                      {n.createdAt && (
                        <span className={s.metaItem}><FaCalendarAlt /> {formatDate(n.createdAt)}</span>
                      )}
                    </div>
                    <h3 className={s.cardTitle}>{n.title}</h3>
                    {n.excerpt && <p className={s.cardExcerpt}>{n.excerpt}</p>}
                  </div>
                </article>
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className={s.pager}>
                <button
                  className={s.pagerBtn}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                >
                  <FaChevronLeft /> Попередня
                </button>
                <div className={s.pagerInfo}>
                  Сторінка {safePage} із {totalPages}
                </div>
                <button
                  className={s.pagerBtn}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                >
                  Наступна <FaChevronRight />
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <Footer />
    </div>
  );
}
