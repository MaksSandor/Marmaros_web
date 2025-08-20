import React, { useState } from "react";
import Header from "../headerImg/header";
import Location from "../location/location";
import Footer from "../footer/footer";
import s from "./contacts_style.module.css";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaPaperPlane } from "react-icons/fa";

export default function ContactsPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.subject || !form.message) {
      setError("Заповніть усі поля, будь ласка.");
      return;
    }
    // простенька валідація email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) {
      setError("Вкажіть коректний email.");
      return;
    }

    // Якщо захочеш — розкоментуй та під’єднай бекенд.
    // try {
    //   setSending(true);
    //   const res = await fetch("http://localhost:3001/api/contact", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(form),
    //   });
    //   if (!res.ok) throw new Error("Send failed");
    //   setDone(true);
    //   setForm({ name: "", email: "", subject: "", message: "" });
    // } catch {
    //   setError("Не вдалося надіслати. Спробуйте пізніше.");
    // } finally {
    //   setSending(false);
    // }

    // Поки без бекенду:
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setDone(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    }, 900);
  }

  return (
    <div className={s.page}>
      <Header />
      <Location currentPage="Контакти" />

      {/* Hero */}
      <section className={s.hero}>
        <div className={s.heroShade} />
        <div className={s.heroInner}>
          <h1 className={s.heroTitle}>Звертайтесь до нас!</h1>
          <p className={s.heroSub}>
            Якщо у вас є питання, на які не знайшли відповіді на сайті — напишіть нам або використайте контакти нижче.
          </p>
          <div className={s.heroChips}>
            <span className={`${s.chip} ${s.chipSoft}`}>Працюємо щодня</span>
            <span className={`${s.chip} ${s.chipGrad}`}>Швидкий зворотний зв’язок</span>
          </div>
        </div>
      </section>

      {/* Дві колонки */}
      <main className={s.grid}>
        {/* Ліва: контакти */}
        <aside className={s.card}>
          <h2 className={s.cardTitle}>Контакти</h2>
          <p className={s.cardText}>
            Якщо у вас щось цікавить або питання, на яке не було отримано відповіді на нашому веб-сайті, зв’яжіться з нами:
          </p>

          <ul className={s.contactList}>
            <li className={s.contactItem}>
              <span className={s.icon}><FaMapMarkerAlt /></span>
              <div>
                <div className={s.cLabel}>Адреса</div>
                <div className={s.cValue}>м. Рівне, вул. Шкільна 2 (2-й поверх)</div>
              </div>
            </li>
            <li className={s.contactItem}>
              <span className={s.icon}><FaPhoneAlt /></span>
              <div>
                <div className={s.cLabel}>Телефон</div>
                <a className={s.cValueLink} href="tel:+380688600680">(068)-860-068-0</a>
              </div>
            </li>
            <li className={s.contactItem}>
              <span className={s.icon}><FaEnvelope /></span>
              <div>
                <div className={s.cLabel}>Email</div>
                <a className={s.cValueLink} href="mailto:marmarosrv@ukr.net">marmarosrv@ukr.net</a>
              </div>
            </li>
          </ul>

          {/* Міні блок “Маєте питання?” */}
          <div className={s.callout}>
            <div className={s.calloutTitle}>Маєте питання?</div>
            <div className={s.calloutSub}>БУДЕМО НА ЗВ'ЯЗКУ</div>
          </div>
        </aside>

        {/* Права: форма */}
        <section className={s.card}>
          <h2 className={s.cardTitle}>Напишіть до нас</h2>
          <form className={s.form} onSubmit={onSubmit}>
            <div className={s.row}>
              <div className={s.field}>
                <label className={s.label}>Ваше ім’я</label>
                <input
                  className={s.input}
                  name="name"
                  placeholder="Вкажіть ім’я"
                  value={form.name}
                  onChange={onChange}
                />
              </div>
              <div className={s.field}>
                <label className={s.label}>Email</label>
                <input
                  className={s.input}
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={onChange}
                />
              </div>
            </div>

            <div className={s.field}>
              <label className={s.label}>Тема</label>
              <input
                className={s.input}
                name="subject"
                placeholder="Коротко про що питання"
                value={form.subject}
                onChange={onChange}
              />
            </div>

            <div className={s.field}>
              <label className={s.label}>Повідомлення</label>
              <textarea
                className={`${s.input} ${s.textarea}`}
                name="message"
                rows={6}
                placeholder="Опишіть деталі..."
                value={form.message}
                onChange={onChange}
              />
            </div>

            {error && <div className={s.error}>{error}</div>}
            {done && <div className={s.ok}>Дякуємо! Ваше повідомлення надіслано.</div>}

            <button className={s.btnGrad} type="submit" disabled={sending}>
              <FaPaperPlane />
              {sending ? " Відправляємо..." : " Відправити"}
            </button>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
}
