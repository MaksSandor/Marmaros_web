import React, { useEffect, useMemo, useState } from "react";
import s from "./booking_style.module.css";
import { FaTimes, FaUser, FaPhone, FaCheck, FaCreditCard, FaBus } from "react-icons/fa";

// ============ УТИЛІТИ ============
const withBase = (p) => (!p ? "" : p.startsWith("http") ? p : `http://localhost:3001${p}`);
const currency = (n) => `${Number(n || 0).toLocaleString("uk-UA")} грн`;

// Типовий макет буса
const defaultLayout = { rows: 10, cols: 4, aisleAfterCol: 1 };

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

// Читаємо юзера/префи з localStorage
function readUserAndPrefs() {
  let user = null;
  try {
    const raw = localStorage.getItem("user");
    if (raw) {
      const parsed = JSON.parse(raw);
      user = parsed?.user ? parsed.user : parsed;
    }
  } catch {}
  let prefs = {};
  try {
    const pr = localStorage.getItem("profilePrefs");
    prefs = pr ? JSON.parse(pr) : {};
  } catch {}
  const PIB = user?.PIB || "";
  const phone = prefs.phone || user?.phone || "";
  const phoneVerified = !!(prefs.phoneVerified || user?.phoneVerified);
  return { user, PIB, phone, phoneVerified };
}

// ============ КАРТА СИДІНЬ ============
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
        style={{ gridTemplateColumns: `repeat(${layout.cols + 1}, 1fr)` }}
      >
        {seats.map((seat) => {
          const afterAisle = seat.col === layout.aisleAfterCol + 1;
          const classes = [s.seat];
          if (isTaken(seat.id)) classes.push(s.seatTaken);
          else if (isHeld(seat.id)) classes.push(s.seatHeld);
          else if (isSelected(seat.id)) classes.push(s.seatSelected);

          return (
            <React.Fragment key={seat.id}>
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
export default function BookingMenu({ open, onClose, tour, layout }) {
  // місця
  const [takenSeats, setTakenSeats] = useState([]);
  const [heldSeats, setHeldSeats] = useState([]);
  const [selected, setSelected] = useState([]);

  // профіль/дані
  const { user, PIB: storedPIB, phone: storedPhone, phoneVerified: storedVerified } = useMemo(
    () => readUserAndPrefs(),
    [open]
  );
  const loggedIn = !!user;

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [verified, setVerified] = useState(false);

  // sms
  const [codeSent, setCodeSent] = useState(false);
  const [smsCode, setSmsCode] = useState("");

  // платіж
  const [paying, setPaying] = useState(false);

  // Вираховуємо, які кроки реально потрібні
  const needDataStep = !(loggedIn && storedPIB);          // немає ПІБ => показати крок "Дані"
  const needVerifyStep = !(loggedIn && storedVerified);    // телефон не верифікований => показати "Код"

  // Конфігурація кроків (динамічно)
  const steps = useMemo(() => {
    const arr = [{ key: "seats", label: "Місця" }];
    if (needDataStep) arr.push({ key: "data", label: "Дані" });
    if (needVerifyStep) arr.push({ key: "code", label: "Код" });
    arr.push({ key: "pay", label: "Оплата" });
    return arr;
  }, [needDataStep, needVerifyStep]);

  const [stepIndex, setStepIndex] = useState(0);
  const step = steps[stepIndex]?.key || "seats";
  const total = useMemo(() => selected.length * (tour?.price || 0), [selected, tour?.price]);

  // INIT при відкритті: підставляємо ПІБ/телефон, статус верифікації
  useEffect(() => {
    if (!open) return;
    setSelected([]);
    setCodeSent(false);
    setSmsCode("");
    setPaying(false);

    setFullName(storedPIB || "");
    setPhone(storedPhone || "");
    setVerified(!!storedVerified);
    setStepIndex(0);
  }, [open, storedPIB, storedPhone, storedVerified]);

  // завантаження стану місць
  useEffect(() => {
    if (!open || !tour?._id) return;
    (async () => {
      try {
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

  // hold seats коли обираємо
  useEffect(() => {
    if (!open || selected.length === 0 || !tour?._id) return;
    let active = true;
    (async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/tours/${tour._id}/hold`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ seats: selected }),
        });
        if (!res.ok) throw new Error("hold failed");
        if (active) {
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

  // release seats при закритті
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
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  // Навігація по кроках
  const goNext = () => setStepIndex((i) => Math.min(steps.length - 1, i + 1));
  const goBack = () => setStepIndex((i) => Math.max(0, i - 1));

  // Валідація перед "Далі"
  const nextDisabled =
    (step === "seats" && selected.length === 0) ||
    (step === "data" && (!fullName || !phone.match(/^\+?380\d{9}$/))) ||
    (step === "code" && !verified);

  // SMS надсилання/перевірка (бекенд очікується)
  const sendCode = async () => {
    if (!phone.match(/^\+?380\d{9}$/)) {
      alert("Введи номер у форматі +380XXXXXXXXX");
      return;
    }
    try {
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

  const checkCode = async () => {
    try {
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

  // Оплата
  const pay = async () => {
    if (needVerifyStep && !verified) {
      alert("Спочатку підтверди номер");
      return;
    }
    setPaying(true);
    try {
      const res = await fetch("http://localhost:3001/api/payments/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourId: tour._id,
          seats: selected,
          fullName: fullName || storedPIB || "",
          phone: phone || storedPhone || "",
        }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
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
              <div className={s.headerChips}>
                {loggedIn && <span className={`${s.chip}`}>Вхід: {storedPIB || "Користувач"}</span>}
                {loggedIn && storedVerified && <span className={`${s.chip} ${s.chipOk}`}>Телефон підтверджено</span>}
              </div>
            </div>
          </div>

          <div className={s.steps}>
            {steps.map((st, idx) => (
              <div key={st.key} className={`${s.step} ${idx <= stepIndex ? s.stepActive : ""}`}>
                {idx + 1}. {st.label}
              </div>
            ))}
          </div>
        </div>

        {/* BODY */}
        <div className={s.body}>
          <div className={s.left}>
            {step === "seats" && (
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

            {step === "data" && (
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
                <div className={s.cardNote}>Номер потрібен для SMS-підтвердження та зв’язку по туру.</div>
              </div>
            )}

            {step === "code" && (
              <div className={s.card}>
                <h4>Підтвердження номера</h4>
                {!codeSent ? (
                  <>
                    <p className={s.cardText}>
                      Надішлемо 6-значний код підтвердження на {phone || storedPhone || "вказаний номер"}.
                    </p>
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

            {step === "pay" && (
              <div className={s.card}>
                <h4>Оплата</h4>
                <p className={s.cardText}>
                  Натисніть “Перейти до оплати”, щоб завершити бронювання. Оплата обробляється через захищений платіжний сервіс.
                </p>
                <button className={s.btnPay} onClick={pay} disabled={paying || (needVerifyStep && !verified)}>
                  <FaCreditCard />
                  {paying ? " Створюємо сесію..." : " Перейти до оплати"}
                </button>
                {needVerifyStep && !verified && (
                  <div className={s.cardNote}>Спочатку підтвердіть номер SMS-кодом.</div>
                )}
              </div>
            )}
          </div>

          <div className={s.right}>
            <div className={s.summary}>
              <h4>Підсумок</h4>
              <div className={s.sumRow}><span>Тур:</span> <strong>{tour.name}</strong></div>
              <div className={s.sumRow}><span>Ціна за місце:</span> <strong>{currency(tour.price)}</strong></div>
              <div className={s.sumRow}><span>Обрано місць:</span> <strong>{selected.length}</strong></div>
              <div className={s.seatsList}>{selected.length === 0 ? "—" : selected.sort((a,b)=>a-b).join(", ")}</div>
              <div className={s.total}>Разом: <span>{currency(total)}</span></div>

              <div className={s.divider} />
              <div className={s.row}>
                {stepIndex > 0 ? (
                  <button className={s.btnLight} onClick={goBack}>Назад</button>
                ) : (
                  <span />
                )}
                <button className={s.btnGrad} onClick={goNext} disabled={nextDisabled || stepIndex === steps.length - 1}>
                  {stepIndex < steps.length - 1 ? "Далі" : "Готово"}
                </button>
              </div>
              <div className={s.smallNote}>Натискаючи “Далі”, ви погоджуєтеся з правилами туру.</div>
            </div>
          </div>
        </div>
      </div>

      {/* клік поза шторкою */}
      <div className={s.backdrop} onClick={onClose} />
    </div>
  );
}
