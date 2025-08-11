import React, { useMemo } from "react";
import Header from "../headerImg/header";
import style from "./style.module.css";
import { useNavigate } from "react-router-dom";
import useTourCards from "../ToursPage/useTourCards";
import TourCarousel from "./TourCarousel";
import Footer from "../footer/footer";

// Хелпери
const currency = (n) => `${Number(n || 0).toLocaleString("uk-UA")} грн`;

function Row({ title, tours, onCardClick, subtitle }) {
  if (!tours || tours.length === 0) return null;
  return (
    <section className={style.rowSection}>
      <div className={style.rowHead}>
        <h2 className={style.rowTitle}>{title}</h2>
        {subtitle ? <div className={style.rowSub}>{subtitle}</div> : null}
      </div>
      <div className={style.rowScroller}>
        {tours.map((t) => (
          <div key={t.id || t._id || t.name} className={style.card} onClick={() => onCardClick(t)}>
            <div className={style.cardMedia} style={{ backgroundImage: `url(${t.img})` }} />
            <div className={style.cardShade} />
            <div className={style.cardBody}>
              <div className={style.cardTopLine}>
                {t.new ? <span className={`${style.chip} ${style.chipNew}`}>NEW</span> : null}
                {t.old_price > t.price ? (
                  <span className={`${style.chip} ${style.chipSale}`}>
                    -{Math.round(((t.old_price - t.price) / t.old_price) * 100)}%
                  </span>
                ) : null}
              </div>
              <h3 className={style.cardTitle}>{t.name}</h3>
              <div className={style.cardPriceRow}>
                <span className={style.priceNow}>{currency(t.price)}</span>
                {t.old_price > t.price ? <span className={style.priceOld}>{currency(t.old_price)}</span> : null}
              </div>
              <div className={style.cardMeta}>
                <span>Вільних: {t.freePlaces ?? "-"}</span>
                {t.special ? <span className={style.badge}>{t.special}</span> : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function MainPage() {
  const navigate = useNavigate();
  const tours = useTourCards();

  const hotTours = useMemo(
    () => tours.filter((tour) => Number(tour.old_price) > Number(tour.price)),
    [tours]
  );
  const newTours = useMemo(() => tours.filter((t) => !!t.new).slice(0, 8), [tours]);

  const skiTours = useMemo(() => tours.filter((t) => t.special === "ski").slice(0, 10), [tours]);
  const festiveTours = useMemo(() => tours.filter((t) => t.special === "festive").slice(0, 10), [tours]);
  const excursionTours = useMemo(() => tours.filter((t) => t.special === "excursion").slice(0, 10), [tours]);
  const fiveDaysTours = useMemo(() => tours.filter((t) => t.special === "5days").slice(0, 10), [tours]);

  const goDetails = (t) => navigate(`/tours/${t.name}`);

  return (
    <div className={style.page}>
      <Header />

      {/* HERO */}
      <section className={style.hero}>
        <div className={style.heroShade} />
        <div className={style.heroInner}>
          <h1 className={style.heroTitle}>КАРПАТИ</h1>
          <p className={style.heroSub}>Гостинно запрошують на відпочинок</p>
          <div className={style.heroCtas}>
            <button className={style.btnGrad} onClick={() => navigate("/tours")}>Дивитись всі тури</button>
            <a className={style.btnGhost} href="tel:+380688600680">Зателефонувати</a>
          </div>
          <div className={style.heroNote}>marmar.com.ua</div>
        </div>
      </section>

      <main className={style.main}>
        {/* короткий опис SEO */}
        <div className={style.tagline}>
          Тури в Карпати, Закарпаття, екскурсії, лижні та святкові тури. Працюємо цілий рік — обирайте зручні дати та місто відправлення.
        </div>

        {/* Гарячі тури: лишаємо ваш карусель */}
        <section className={style.block}>
          <div className={style.blockHead}>
            <h2 className={style.blockTitle}>🔥 Гарячі тури зі знижками</h2>
          </div>
          <div className={style.blockBody}>
            {hotTours.length === 0 ? (
              <p className={style.empty}>Наразі немає турів зі знижками.</p>
            ) : (
              <TourCarousel tours={hotTours} />
            )}
          </div>
        </section>

        {/* Новинки */}
        <Row
          title="✨ Новинки"
          subtitle="Свіжі пропозиції на найближчі дати"
          tours={newTours}
          onCardClick={goDetails}
        />

        {/* Підбірки за критеріями */}
        <Row title="🎿 Лижні тури" subtitle="Свідовeць, Драгобрат, Буковель" tours={skiTours} onCardClick={goDetails} />
        <Row title="❄️ Зимові / Святкові" subtitle="Новорічні, Різдвяні, День Незалежності" tours={festiveTours} onCardClick={goDetails} />
        <Row title="🏛 Екскурсійні" subtitle="Міста, замки, фести" tours={excursionTours} onCardClick={goDetails} />
        <Row title="🗓 Тур на 5 днів" subtitle="Оптимальний формат для перезавантаження" tours={fiveDaysTours} onCardClick={goDetails} />

        {/* Чому ми — збережено, але стилізовано під новий стиль */}
        <section className={style.features}>
          <h2 className={style.sectionTitle}>Чому ми?</h2>
          <div className={style.featuresGrid}>
            <div className={style.featureCard}>
              <div className={style.featureIcon}>🔒</div>
              <h3>Безпека туристів</h3>
              <p>Страхування під час подорожі на транспорті в кожному турі.</p>
            </div>
            <div className={style.featureCard}>
              <div className={style.featureIcon}>🎧</div>
              <h3>Індивідуальний підхід</h3>
              <p>Підбираємо тур і умови саме під вас, враховуючи побажання.</p>
            </div>
            <div className={style.featureCard}>
              <div className={style.featureIcon}>🤝</div>
              <h3>Програма лояльності</h3>
              <p>Знижки постійним клієнтам, дітям; місця для ветеранів АТО.</p>
            </div>
            <div className={style.featureCard}>
              <div className={style.featureIcon}>🗓</div>
              <h3>Безперервний сезон</h3>
              <p>Щотижневі відправлення протягом року, незалежно від пори року.</p>
            </div>
            <div className={style.featureCard}>
              <div className={style.featureIcon}>⭐</div>
              <h3>Комфорт і якість</h3>
              <p>Кращі готелі/садиби, перевірені партнери та гіди.</p>
            </div>
            <div className={style.featureCard}>
              <div className={style.featureIcon}>🇺🇦</div>
              <h3>Єднаємо країну</h3>
              <p>Відправлення в Карпати майже з усіх регіонів з 2017 року.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default MainPage;
