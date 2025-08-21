// src/GalleryPage/ToursGalleryPage.js
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../headerImg/header";
import Location from "../location/location";
import Footer from "../footer/footer";
import useTourCards from "../ToursPage/useTourCards";
import s from "./gallery_style.module.css";
import { FaImages, FaChevronLeft, FaChevronRight, FaSearchPlus } from "react-icons/fa";

const withBase = (p) => (!p ? "" : p.startsWith("http") ? p : `http://localhost:3001${p}`);

function Lightbox({ images = [], index = 0, onClose }) {
  const [i, setI] = useState(index);
  useEffect(() => { setI(index); }, [index]);
  if (!images || images.length === 0) return null;

  const prev = () => setI((p) => (p - 1 + images.length) % images.length);
  const next = () => setI((p) => (p + 1) % images.length);

  return (
    <div className={s.lbWrap} onClick={onClose}>
      <div className={s.lbInner} onClick={(e) => e.stopPropagation()}>
        <button className={s.lbClose} onClick={onClose} aria-label="Закрити">×</button>
        <button className={`${s.lbNav} ${s.lbPrev}`} onClick={prev} aria-label="Попереднє">
          <FaChevronLeft />
        </button>
        <img className={s.lbImg} src={withBase(images[i])} alt={`Фото ${i + 1}`} />
        <button className={`${s.lbNav} ${s.lbNext}`} onClick={next} aria-label="Наступне">
          <FaChevronRight />
        </button>
        <div className={s.lbCounter}>{i + 1} / {images.length}</div>
      </div>
    </div>
  );
}

function AlbumModal({ open, tour, album, onClose }) {
  const [lightbox, setLightbox] = useState({ open: false, index: 0 });

  if (!open || !album) return null;

  const imgs = (album.photos || []).map(withBase);

  return (
    <div className={s.modal}>
      <div className={s.sheet}>
        <button className={s.close} onClick={onClose} aria-label="Закрити">×</button>
        <div className={s.modalHeader}>
          <div className={s.modalLeft}>
            <img className={s.cover} src={withBase(tour.img)} alt={tour.name} />
            <div>
              <h3 className={s.tourName}>{tour.name}</h3>
              <div className={s.albumTitle}><FaImages />&nbsp;{album.title}</div>
            </div>
          </div>
          <div className={s.countTag}>{imgs.length} фото</div>
        </div>

        <div className={s.grid}>
          {imgs.map((src, idx) => (
            <button
              key={idx}
              className={s.thumb}
              onClick={() => setLightbox({ open: true, index: idx })}
              aria-label={`Відкрити фото ${idx + 1}`}
              style={{ backgroundImage: `url(${src})` }}
            >
              <span className={s.zoom}><FaSearchPlus /></span>
            </button>
          ))}
        </div>
      </div>
      <div className={s.backdrop} onClick={onClose} />
      {lightbox.open && (
        <Lightbox
          images={imgs}
          index={lightbox.index}
          onClose={() => setLightbox({ open: false, index: 0 })}
        />
      )}
    </div>
  );
}

export default function ToursGalleryPage() {
  const tours = useTourCards(); // очікує { img, name, galleries?, Gallery?, ... }
  const navigate = useNavigate();

  // опційно підтягуємо загальну головну галерею (як окрему картку, може знадобитись)
  const [mainGallery, setMainGallery] = useState([]);
  useEffect(() => {
    fetch("http://localhost:3001/api/gallery/maingallery")
      .then((r) => (r.ok ? r.json() : []))
      .then((arr) => setMainGallery(Array.isArray(arr) ? arr : []))
      .catch(() => {});
  }, []);

  // нормалізуємо альбоми для кожного туру
  const normalized = useMemo(() => {
    return (tours || []).map((t) => {
      // 1) якщо є structure t.galleries [{title, photos[]}]
      if (Array.isArray(t.galleries) && t.galleries.length > 0) {
        return { ...t, _albums: t.galleries };
      }
      // 2) інакше якщо є старе поле Gallery: [String]
      if (Array.isArray(t.Gallery) && t.Gallery.length > 0) {
        return { ...t, _albums: [{ title: "Галерея", photos: t.Gallery }] };
      }
      // 3) fallback — хоч один кадр (обкладинка)
      if (t.img) {
        return { ...t, _albums: [{ title: "Фото туру", photos: [t.img] }] };
      }
      return { ...t, _albums: [] };
    });
  }, [tours]);

  const [active, setActive] = useState(null); // { tour, album }

  return (
    <div className={s.page}>
      <Header />
      <Location currentPage="Галерея турів" />

      <div className={s.heroBg} />
      <div className={s.heroShade} />

      <div className={s.wrap}>
        <div className={s.head}>
          <h1 className={s.title}>Галерея турів</h1>
          <p className={s.subtitle}>
            Переглянь фото-альбоми по кожному туру. Натисни на альбом — відкриється міні-галерея з лайтбоксом.
          </p>
        </div>

        {/* Картка "Головна галерея" (не обов'язково) */}
        {mainGallery.length > 0 && (
          <div className={s.mainGalleryCard}>
            <div className={s.mainGalleryHeading}>
              <h2><FaImages /> Головна галерея</h2>
              <div className={s.countDot}>{mainGallery.length} фото</div>
            </div>
            <div className={s.mainStrip}>
              {mainGallery.slice(0, 10).map((src, i) => (
                <div key={i} className={s.mainThumb} style={{ backgroundImage: `url(${withBase(src)})` }} />
              ))}
            </div>
          </div>
        )}

        {/* Сітка турів */}
        <div className={s.cards}>
          {normalized.map((t) => {
            const albums = t._albums || [];
            const cover = withBase(t.img);
            return (
              <div key={t._id || t.id || t.name} className={s.card}>
                <div className={s.media} style={{ backgroundImage: `url(${cover})` }} />
                <div className={s.shade} />
                <div className={s.body}>
                  <h3 className={s.cardTitle}>{t.name}</h3>
                  <div className={s.albums}>
                    {albums.length === 0 ? (
                      <div className={s.emptyNote}>Альбомів поки немає</div>
                    ) : (
                      albums.map((al) => {
                        const first = al.photos?.[0] ? withBase(al.photos[0]) : cover;
                        return (
                          <button
                            key={al._id || al.title}
                            className={s.albumBtn}
                            onClick={() => setActive({ tour: t, album: al })}
                          >
                            <span className={s.albumThumb} style={{ backgroundImage: `url(${first})` }} />
                            <span className={s.albumMeta}>
                              <span className={s.albumTitle}>{al.title}</span>
                              <span className={s.albumCount}>{al.photos?.length || 0} фото</span>
                            </span>
                          </button>
                        );
                      })
                    )}
                  </div>

                  <div className={s.actions}>
                    <button className={s.btnLight} onClick={() => navigate(`/tours/${t.name}`)}>
                      Перейти до туру
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* MODAL */}
      <AlbumModal
        open={!!active}
        tour={active?.tour}
        album={active?.album}
        onClose={() => setActive(null)}
      />

      <Footer />
    </div>
  );
}
