import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../headerImg/header";
import style from "./profileStyle.module.css";
import userPh from "./user.png";
import { FaEdit, FaCheckCircle, FaPhone, FaMapMarkerAlt, FaBell, FaSignOutAlt, FaHeart } from "react-icons/fa";

/** Helpers */
const trim = (s) => String(s || "").trim();
const isUaPhone = (v) => /^(\+?380|0)\d{9}$/.test(trim(v));
const cityOptions = [
  "Рівне", "Луцьк", "Львів", "Стрий", "Івано-Франківськ",
  "Тернопіль", "Житомир", "Київ", "Хмельницький", "Вінниця",
];

function readUserFromLS() {
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed.user ? parsed.user : parsed;
  } catch {
    return null;
  }
}
function writeUserToLS(userObj) {
  // зберігаємо у тому ж форматі, в якому логінимось — без вкладеного user
  localStorage.setItem("user", JSON.stringify(userObj));
}

function Profile() {
  const [user, setUser] = useState(null);

  // локальні налаштування профілю (без бекенду)
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifViber, setNotifViber] = useState(false);
  const [notifWhatsApp, setNotifWhatsApp] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);

  const [pibLast, setPibLast] = useState("");
  const [pibFirst, setPibFirst] = useState("");
  const [pibMiddle, setPibMiddle] = useState("");

  const navigate = useNavigate();

  // INIT
  useEffect(() => {
    const u = readUserFromLS();
    if (u) {
      setUser(u);

      // PIB -> розбити на 3 частини, якщо можливо
      const parts = String(u.PIB || "").split(" ").filter(Boolean);
      setPibLast(parts[0] || "");
      setPibFirst(parts[1] || "");
      setPibMiddle(parts.slice(2).join(" ") || "");

      // prefs
      try {
        const prefsRaw = localStorage.getItem("profilePrefs");
        const prefs = prefsRaw ? JSON.parse(prefsRaw) : {};
        setPhone(prefs.phone || u.phone || "");
        setCity(prefs.city || u.city || "");
        setNotifEmail(prefs.notifEmail ?? true);
        setNotifViber(prefs.notifViber ?? false);
        setNotifWhatsApp(prefs.notifWhatsApp ?? false);
        setPhoneVerified(!!(prefs.phoneVerified || u.phoneVerified));
      } catch {
        /* ignore */
      }
    }
  }, []);

  const favoritesCount = useMemo(() => {
    try {
      const favRaw = localStorage.getItem("favorites");
      const arr = favRaw ? JSON.parse(favRaw) : [];
      return Array.isArray(arr) ? arr.length : 0;
    } catch {
      return 0;
    }
  }, []);

  if (!user) {
    return (
      <div>
        <Header />
        <div className={style.background} />
        <div className={style.secondBG} />
        <div style={{ padding: 40, textAlign: "center", color: "#fff" }}>
          Користувач не знайдений. Увійдіть в акаунт.
        </div>
      </div>
    );
  }

  const fullName = `${trim(pibLast)} ${trim(pibFirst)} ${trim(pibMiddle)}`.replace(/\s+/g, " ").trim();

  function persistPrefs(extra = {}) {
    const prefs = {
      phone,
      city,
      notifEmail,
      notifViber,
      notifWhatsApp,
      phoneVerified,
      ...extra,
    };
    localStorage.setItem("profilePrefs", JSON.stringify(prefs));
  }

  function handleSaveProfile() {
    // валідація
    if (!trim(pibLast) || !trim(pibFirst) || !trim(pibMiddle)) {
      alert("Вкажіть: Прізвище, Ім’я та По батькові.");
      return;
    }
    if (phone && !isUaPhone(phone)) {
      alert("Телефон має бути у форматі +380XXXXXXXXX або 0XXXXXXXXX");
      return;
    }

    const nextUser = { ...user, PIB: fullName, phone, city, phoneVerified };
    setUser(nextUser);
    writeUserToLS(nextUser);
    persistPrefs();
    setEditMode(false);
  }

  function handleLogout() {
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  }

  function openOtp() {
    if (!phone || !isUaPhone(phone)) {
      alert("Спочатку вкажіть коректний номер телефону.");
      return;
    }
    setOtpOpen(true);
    setOtpCode("");
  }
  function confirmOtp() {
    if (otpCode === "123456") {
      setPhoneVerified(true);
      persistPrefs({ phoneVerified: true });
      setOtpOpen(false);
      alert("Телефон підтверджено!");
    } else {
      alert("Невірний код. Спробуйте ще раз (демо-код: 123456).");
    }
  }

  return (
    <div className={style.page}>
      <Header />
      <div className={style.background} />
      <div className={style.secondBG} />

      <div className={style.wrap}>
        {/* LEFT: Profile card */}
        <section className={`${style.card} ${style.profileCard}`}>
          <div className={style.profileHead}>
            <div className={style.avatarWrap}>
              <img src={userPh} className={style.avatar} alt="avatar" />
              {phoneVerified && (
                <span className={style.verifiedBadge} title="Телефон підтверджено">
                  <FaCheckCircle />
                </span>
              )}
            </div>
            <div className={style.nameBlock}>
              <h1 className={style.title}>{fullName || user.PIB || "Користувач"}</h1>
              <div className={style.emailText}>{user.gmail}</div>
            </div>
            <button
              className={`${style.btn} ${style.btnSmall}`}
              onClick={() => setEditMode((v) => !v)}
              title="Редагувати профіль"
            >
              <FaEdit />&nbsp;Редагувати
            </button>
          </div>

          {!editMode ? (
            <div className={style.infoList}>
              <div className={style.infoRow}>
                <FaPhone className={style.icon} />
                <span>{phone || "Номер не вказано"}</span>
                <span className={style.flex1} />
                <button
                  className={`${style.pill} ${phoneVerified ? style.pillOk : style.pillWarn}`}
                  onClick={openOtp}
                  title={phoneVerified ? "Повторна верифікація" : "Підтвердити телефон"}
                >
                  {phoneVerified ? "Підтверджено" : "Підтвердити"}
                </button>
              </div>
              <div className={style.infoRow}>
                <FaMapMarkerAlt className={style.icon} />
                <span>Місто відправлення: {city || "не обрано"}</span>
              </div>
              <div className={style.infoRow}>
                <FaBell className={style.icon} />
                <span>
                  Сповіщення: {notifEmail ? "Email " : ""}
                  {notifViber ? "Viber " : ""}
                  {notifWhatsApp ? "WhatsApp " : ""}
                  {!notifEmail && !notifViber && !notifWhatsApp ? "вимкнені" : ""}
                </span>
              </div>
            </div>
          ) : (
            <div className={style.editForm}>
              <div className={style.formGrid}>
                <label className={style.label}>
                  Прізвище
                  <input
                    className={style.input}
                    value={pibLast}
                    onChange={(e) => setPibLast(e.target.value)}
                    placeholder="Шевченко"
                  />
                </label>
                <label className={style.label}>
                  Ім’я
                  <input
                    className={style.input}
                    value={pibFirst}
                    onChange={(e) => setPibFirst(e.target.value)}
                    placeholder="Тарас"
                  />
                </label>
                <label className={style.label}>
                  По батькові
                  <input
                    className={style.input}
                    value={pibMiddle}
                    onChange={(e) => setPibMiddle(e.target.value)}
                    placeholder="Григорович"
                  />
                </label>

                <label className={style.label}>
                  Телефон
                  <input
                    className={style.input}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+380XXXXXXXXX"
                  />
                </label>

                <label className={style.label}>
                  Місто відправлення
                  <select
                    className={style.input}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  >
                    <option value="">— Оберіть місто —</option>
                    {cityOptions.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </label>

                <div className={style.labelWide}>
                  <span className={style.subTitle}>Сповіщення</span>
                  <div className={style.toggles}>
                    <label className={style.toggleItem}>
                      <input
                        type="checkbox"
                        checked={notifEmail}
                        onChange={(e) => setNotifEmail(e.target.checked)}
                      />
                      Email
                    </label>
                    <label className={style.toggleItem}>
                      <input
                        type="checkbox"
                        checked={notifViber}
                        onChange={(e) => setNotifViber(e.target.checked)}
                      />
                      Viber
                    </label>
                    <label className={style.toggleItem}>
                      <input
                        type="checkbox"
                        checked={notifWhatsApp}
                        onChange={(e) => setNotifWhatsApp(e.target.checked)}
                      />
                      WhatsApp
                    </label>
                  </div>
                </div>
              </div>

              <div className={style.editActions}>
                <button className={style.btnGhost} onClick={() => setEditMode(false)}>Скасувати</button>
                <button className={style.btn} onClick={handleSaveProfile}>Зберегти</button>
              </div>
            </div>
          )}
        </section>

        {/* RIGHT: Quick stats & actions */}
        <section className={style.sideGrid}>
          <div className={style.card}>
            <div className={style.kpiRow}>
              <div className={style.kpiItem}>
                <div className={style.kpiLabel}>Обране</div>
                <div className={style.kpiValue}>
                  <FaHeart className={style.kpiIcon} /> {favoritesCount}
                </div>
              </div>
              <div className={style.kpiItem}>
                <div className={style.kpiLabel}>Верифікація</div>
                <div className={style.kpiValue}>
                  {phoneVerified ? "OK" : "—"}
                </div>
              </div>
              <div className={style.kpiItem}>
                <div className={style.kpiLabel}>Місто</div>
                <div className={style.kpiValue}>{city || "-"}</div>
              </div>
            </div>
          </div>

          <div className={style.card}>
            <div className={style.actionsCol}>
              <button className={style.btn} onClick={() => navigate("/tours")}>
                До турів
              </button>
              <button className={style.btnGhost} onClick={() => navigate("/")}>
                На головну
              </button>
              <button className={`${style.btnGhost} ${style.btnWarn}`} onClick={handleLogout}>
                <FaSignOutAlt />&nbsp;Вийти
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* OTP модалка */}
      {otpOpen && (
        <div className={style.modalBackdrop} onClick={() => setOtpOpen(false)}>
          <div className={style.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={style.modalTitle}>Підтвердження телефону</h3>
            <p className={style.modalText}>Ми надіслали код на {phone}. Введіть 6 цифр:</p>
            <input
              className={style.input}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="123456"
              inputMode="numeric"
            />
            <div className={style.modalActions}>
              <button className={style.btnGhost} onClick={() => setOtpOpen(false)}>Скасувати</button>
              <button className={style.btn} onClick={confirmOtp}>Підтвердити</button>
            </div>
            <div className={style.helper}>Демо-код: <b>123456</b></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
