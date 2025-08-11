import React, { useEffect, useMemo, useState } from "react";
import s from "./booking_style.module.css";
import { FaTimes, FaUser, FaPhone, FaCheck, FaCreditCard, FaBus } from "react-icons/fa";

// ============ УТИЛІТИ ============
const withBase = (p) => (!p ? "" : p.startsWith("http") ? p : `http://localhost:3001${p}`);
const currency = (n) => `${Number(n || 0).toLocaleString("uk-UA")} грн`;

// Типовий макет буса: 10 рядів * 4 сидіння (2 + прохід + 2) = 40 місць
// Можеш змінити під свій парк (rows, cols, aisleIndex, reservedSeats із бекенду)
const defaultLayout = {
  rows: 10,
  cols: 4,
  aisleAfterCol: 1, // після якої колонки робимо прохід (0-based)
};

function buildSeatList(layout) {
  const seats = [];
  let num = 1;
  for (let r = 0; r < layout.rows; r++) {
    for (let c = 0; c < layout.cols; c++) {
      seats.push({ id: num, row: r, col: c });
      num++;
    }
  }
  return seats;
}

// ============ КОМПОНЕНТ MAP СИДІНЬ ============
function SeatMap({ layout = defaultLayout, takenSeats = [], heldSeats = [], selected, onToggle }) {
  const seats = useMemo(() => buildSeatList(layout), [layout]);
  const isTaken = (id) => takenSeats.includes(id);
  const isHeld = (id) => heldSeats.includes(id);
  const isSelected = (id) => selected.includes(id);

  return (
    <div className={s.seatMapWrap}>
      <div className={s.busHead}><FaBus /> Схема автобуса</div>

      <div
        className={s.seatGrid}
        style={{
          gridTemplateColumns: `repeat(${layout.cols + 1}, 1fr)`, // +1 під візуальний прохід
        }}
      >
        {seats.map((seat) => {
          const afterAisle = seat.col === layout.aisleAfterCol + 1;
          const classes = [s.seat];
        if (isTaken(seat.id)) classes.push(s.seatTaken);
          else if (isHeld(seat.id)) classes.push(s.seatHeld);
          else if (isSelected(seat.id)) classes.push(s.seatSelected);

          return (
            <React.Fragment key={seat.id}>
              {/* Сидіння */}
              <button
                type="button"
                className={classes.join(" ")}
                onClick={() => {
                  if (!isTaken(seat.id) && !isHeld(seat.id)) onToggle(seat.id);
                }}
                aria-label={`Місце ${seat.id}`}
              >
                {seat.id}
              </button>

              {/* Вставка "порожньої" колонки для проходу після зазначеного індексу */}
              {afterAisle && <div className={s.aisle} aria-hidden />}
            </React.Fragment>
          );
        })}
      </div>

      <div className={s.legend}>
        <div><span className={`${s.legendDot} ${s.legendFree}`} /> Вільно</div>
        <div><span className={`${s.legendDot} ${s.legendSelected}`} /> Вибрано</div>
        <div><span className={`${s.legendDot} ${s.legendHeld}`} /> Резервується</div>
        <div><span className={`${s.legendDot} ${s.legendTaken}`} /> Зайнято</div>
      </div>
    </div>
  );
}

// ============ ОСНОВНИЙ МОДАЛ ============
export default function BookingMenu({
  open,
  onClose,
  tour,        // об'єкт туру (name, price, id, img, ... )
  layout,      // опціонально свій макет автобуса
}) {
  const [step, setStep] = useState(1);
  const [takenSeats, setTakenSeats] = useState([]);   // із бекенду
  const [heldSeats, setHeldSeats] = useState([]);     // тимчасово зайняті іншими
  const [selected, setSelected] = useState([]);       // наш вибір

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [smsCode, setSmsCode] = useState("");
  const [verified, setVerified] = useState(false);
  const [paying, setPaying] = useState(false);

  const total = useMemo(() => selected.length * (tour?.price || 0), [selected, tour?.price]);

  // 1) ПІДТЯГУЄМО СТАН МІСЦЬ ДЛЯ ТУРУ
  useEffect(() => {
    if (!open || !tour?._id) return;
    (async () => {
      try {
        // очікуваний бекенд: GET /api/tours/:id/seats => { taken: number[], held: number[] }
        const res = await fetch(`http://localhost:3001/api/tours/${tour._id}/seats`);
        if (res.ok) {
          const data = await res.json();
          setTakenSeats(Array.isArray(data.taken) ? data.taken : []);
          setHeldSeats(Array.isArray(data.held) ? data.held : []);
        }
      } catch (e) {
        console.warn("Не зміг отримати місця, використовую дефолт:", e);
        setTakenSeats([]); setHeldSeats([]);
      }
    })();
  }, [open, tour?._id]);

  // 2) РЕЗЕРВ/ЗНЯТТЯ РЕЗЕРВУ НА ОБРАНІ МІСЦЯ ПІД ЧАС ВИБОРУ
  useEffect(() => {
    if (!open || selected.length === 0 || !tour?._id) return;
    let active = true;
    (async () => {
      try {
        // POST /api/tours/:id/hold { seats: number[] } => { ok: true }
        const res = await fetch(`http://localhost:3001/api/tours/${tour._id}/hold`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ seats: selected }),
        });
        if (!res.ok) throw new Error("hold failed");
        if (active) {
          // оновлюємо held знову
          const refresh = await fetch(`http://localhost:3001/api/tours/${tour._id}/seats`);
          const data = await refresh.json();
          setHeldSeats(Array.isArray(data.held) ? data.held : []);
        }
      } catch (e) {
        console.warn("Hold error:", e);
      }
    })();
    return () => { active = false; };
  }, [selected, open, tour?._id]);

  // 3) ЗНЯТИ РЕЗЕРВ ПРИ ЗАКРИТТІ/UNMOUNT
  useEffect(() => {
    return () => {
      if (!tour?._id || selected.length === 0) return;
      fetch(`http://localhost:3001/api/tours/${tour._id}/release`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seats: selected }),
      }).catch(() => {});
    };
  }, [tour?._id, selected]);

  // TOGGLES
  const toggleSeat = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // STEP HANDLERS
  const goNext = () => setStep((p) => Math.min(4, p + 1));
  const goBack = () => setStep((p) => Math.max(1, p - 1));

  // 4) SMS-КОД: НАДСИЛАННЯ
  const sendCode = async () => {
    if (!phone.match(/^\+?380\d{9}$/)) {
      alert("Введи номер у форматі +380XXXXXXXXX");
      return;
    }
    try {
      // POST /api/verify/send { phone } => { ok: true }
      const res = await fetch("http://localhost:3001/api/verify/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      if (res.ok) {
        setCodeSent(true);
        alert("Код надіслано в SMS");
      } else {
        alert("Не вдалося надіслати код");
      }
    } catch {
      alert("Помилка відправки коду");
    }
  };

  // 5) SMS-КОД: ПІДТВЕРДЖЕННЯ
  const checkCode = async () => {
    try {
      // POST /api/verify/check { phone, code } => { verified: boolean }
      const res = await fetch("http://localhost:3001/api/verify/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: smsCode }),
      });
      if (res.ok) {
        const data = await res.json();
        setVerified(!!data.verified);
        if (!data.verified) alert("Невірний код");
      } else {
        alert("Не вдалося перевірити код");
      }
    } catch {
      alert("Помилка перевірки");
    }
  };

  // 6) ОПЛАТА (Stripe Checkout як приклад)
  const pay = async () => {
    if (!verified) {
      alert("Спочатку підтверди номер");
      return;
    }
    setPaying(true);
    try {
      // POST /api/payments/create-checkout-session
      // { tourId, seats, fullName, phone } => { url }
      const res = await fetch("http://localhost:3001/api/payments/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourId: tour._id,
          seats: selected,
          fullName,
          phone,
        }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url; // редірект на Stripe
      } else {
        setPaying(false);
        alert(data?.message || "Не вдалося створити сесію оплати");
      }
    } catch (e) {
      setPaying(false);
      alert("Помилка оплати");
    }
  };

  if (!open) return null;

  return (
    <div className={s.modal}>
      <div className={s.sheet}>
        <button className={s.close} onClick={onClose} aria-label="Закрити">
          <FaTimes />
        </button>

        {/* HEADER */}
        <div className={s.header}>
          <div className={s.headerLeft}>
            <img className={s.tourImg} src={withBase(tour.img)} alt={tour.name} />
            <div>
              <h3 className={s.tourName}>{tour.name}</h3>
              <div className={s.tourPrice}>{currency(tour.price)}</div>
            </div>
          </div>
          <div className={s.steps}>
            <div className={`${s.step} ${step >= 1 ? s.stepActive : ""}`}>1. Місця</div>
            <div className={`${s.step} ${step >= 2 ? s.stepActive : ""}`}>2. Дані</div>
            <div className={`${s.step} ${step >= 3 ? s.stepActive : ""}`}>3. Код</div>
            <div className={`${s.step} ${step >= 4 ? s.stepActive : ""}`}>4. Оплата</div>
          </div>
        </div>

        {/* BODY */}
        <div className={s.body}>
          <div className={s.left}>
            {step === 1 && (
              <div className={s.card}>
                <h4>Вибір місць</h4>
                <SeatMap
                  layout={layout || defaultLayout}
                  takenSeats={takenSeats}
                  heldSeats={heldSeats}
                  selected={selected}
                  onToggle={toggleSeat}
                />
                <div className={s.cardNote}>
                  Обери бажані місця (клік по сидінню). Резерв тримається кілька хвилин.
                </div>
              </div>
            )}

            {step === 2 && (
              <div className={s.card}>
                <h4>Дані пасажира</h4>
                <label className={s.label}><FaUser /> Ім’я та прізвище</label>
                <input
                  className={s.input}
                  placeholder="Ваше ПІБ"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                <label className={s.label}><FaPhone /> Телефон (+380...)</label>
                <input
                  className={s.input}
                  placeholder="+380XXXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <div className={s.cardNote}>
                  Номер потрібен для SMS-підтвердження та зв’язку по туру.
                </div>
              </div>
            )}

            {step === 3 && (
              <div className={s.card}>
                <h4>Підтвердження номера</h4>
                {!codeSent ? (
                  <>
                    <p className={s.cardText}>Надішлемо 6-значний код підтвердження на {phone || "вказаний номер"}.</p>
                    <button className={s.btnGrad} onClick={sendCode}>Надіслати код</button>
                  </>
                ) : (
                  <>
                    <label className={s.label}><FaCheck /> Введіть код із SMS</label>
                    <input
                      className={s.input}
                      placeholder="______"
                      value={smsCode}
                      onChange={(e) => setSmsCode(e.target.value)}
                    />
                    <div className={s.row}>
                      <button className={s.btnLight} onClick={sendCode}>Надіслати ще раз</button>
                      <button
                        className={`${s.btnGrad} ${verified ? s.btnGradOk : ""}`}
                        onClick={checkCode}
                      >
                        Підтвердити
                      </button>
                    </div>
                    {verified && <div className={s.okTag}>Номер підтверджено</div>}
                  </>
                )}
              </div>
            )}

            {step === 4 && (
              <div className={s.card}>
                <h4>Оплата</h4>
                <p className={s.cardText}>
                  Натисніть “Перейти до оплати”, щоб завершити бронювання. Оплата обробляється через захищений платіжний сервіс.
                </p>
                <button className={s.btnPay} onClick={pay} disabled={paying || !verified}>
                  <FaCreditCard />
                  {paying ? " Створюємо сесію..." : " Перейти до оплати"}
                </button>
                {!verified && <div className={s.cardNote}>Спочатку підтвердіть номер SMS-кодом.</div>}
              </div>
            )}
          </div>

          <div className={s.right}>
            <div className={s.summary}>
              <h4>Підсумок</h4>
              <div className={s.sumRow}>
                <span>Тур:</span> <strong>{tour.name}</strong>
              </div>
              <div className={s.sumRow}>
                <span>Ціна за місце:</span> <strong>{currency(tour.price)}</strong>
              </div>
              <div className={s.sumRow}>
                <span>Обрано місць:</span> <strong>{selected.length}</strong>
              </div>
              <div className={s.seatsList}>
                {selected.length === 0 ? "—" : selected.sort((a,b)=>a-b).join(", ")}
              </div>
              <div className={s.total}>
                Разом: <span>{currency(total)}</span>
              </div>
              <div className={s.divider} />
              <div className={s.row}>
                {step > 1 ? <button className={s.btnLight} onClick={goBack}>Назад</button> : <span />}
                <button
                  className={s.btnGrad}
                  onClick={goNext}
                  disabled={
                    (step === 1 && selected.length === 0) ||
                    (step === 2 && (!fullName || !phone)) ||
                    (step === 3 && (!verified))
                  }
                >
                  {step < 4 ? "Далі" : "До оплати"}
                </button>
              </div>
              <div className={s.smallNote}>
                Натискаючи “Далі”, ви погоджуєтеся з правилами туру.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* клік поза шторкою */}
      <div className={s.backdrop} onClick={onClose} />
    </div>
  );
}
