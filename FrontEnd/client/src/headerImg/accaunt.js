import React, { useState, useEffect, useMemo } from "react";
import style from "./accStyle.module.css";

/** Validators */
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(String(v || "").trim());
const hasMin8 = (v) => String(v || "").length >= 8;
const trim = (s) => String(s || "").trim();
const normalizeEmail = (v) => trim(v).toLowerCase();

/** API */
function checkSignIn() {
  return !!localStorage.getItem("user");
}

/** ===== Sign In ===== */
function SignInForm({ isVisible }) {
  const [gmail, setGmail] = useState("");
  const [pass, setPass] = useState("");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3001/users")
      .then((r) => {
        if (!r.ok) throw new Error("Помилка при завантаженні користувачів");
        return r.json();
      })
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const canLogin = useMemo(() => isEmail(gmail) && hasMin8(pass), [gmail, pass]);

  const onKeyDown = (e) => {
    if (e.key === "Enter" && canLogin) Login();
  };

  const Login = () => {
    setError("");
    if (!isEmail(gmail)) return setError("Введіть коректний email.");
    if (!hasMin8(pass)) return setError("Пароль має містити щонайменше 8 символів.");

    const email = normalizeEmail(gmail);
    const found = users.find((u) => normalizeEmail(u.gmail) === email && u.password === pass);

    if (found) {
      localStorage.setItem("user", JSON.stringify(found));
      alert("Вхід успішний!");
      window.location.reload();
    } else {
      setError("Неправильний email або пароль");
    }
  };

  return (
    <div className={`${style.SignBlock} ${isVisible ? style.visibleForm : style.hiddenForm}`}>
      <h3 className={style.formTitle}>Вхід</h3>

      <div className={style.inputWrap}>
        <input
          className={style.input}
          placeholder="Ваш email"
          type="email"
          value={gmail}
          onChange={(e) => setGmail(e.target.value)}
          onKeyDown={onKeyDown}
        />
      </div>

      <div className={style.inputWrap}>
        <input
          className={style.input}
          placeholder="Пароль"
          type={showPass ? "text" : "password"}
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <button
          type="button"
          className={style.toggleEye}
          onClick={() => setShowPass((v) => !v)}
          aria-label={showPass ? "Сховати пароль" : "Показати пароль"}
          tabIndex={-1}
        >
          {showPass ? "🙈" : "👁️"}
        </button>
      </div>

      {error && <div className={style.error}>{error}</div>}

      <button
        className={`${style.SignInBtn} ${style.btn}`}
        onClick={Login}
        disabled={!canLogin}
      >
        Увійти
      </button>
    </div>
  );
}

/** ===== Register ===== */
function RegisterForm({ isVisible }) {
  // ПІБ окремими полями
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");

  const [gmail, setGmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);

  const validate = useMemo(() => {
    const e = {};
    if (!trim(lastName)) e.lastName = "Вкажіть прізвище";
    if (!trim(firstName)) e.firstName = "Вкажіть ім’я";
    if (!trim(middleName)) e.middleName = "Вкажіть по батькові";
    if (!isEmail(gmail)) e.gmail = "Некоректний email";
    if (!hasMin8(pass)) e.pass = "Мінімум 8 символів";
    return e;
  }, [lastName, firstName, middleName, gmail, pass]);

  const isValid = Object.keys(validate).length === 0;

  const handleRegister = () => {
    if (!isValid) return;

    const PIB = `${trim(lastName)} ${trim(firstName)} ${trim(middleName)}`;
    const newUser = { PIB, gmail: normalizeEmail(gmail), password: pass };

    fetch("http://localhost:3001/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    })
      .then((r) => {
        if (!r.ok) throw new Error("Помилка під час реєстрації");
        return r.json();
      })
      .then((data) => {
        alert("Реєстрація успішна!");
        localStorage.setItem("user", JSON.stringify(data));
        window.dispatchEvent(new Event("storage"));
      })
      .catch((err) => {
        console.error(err);
        alert("Щось пішло не так при реєстрації!");
      });
  };

  return (
    <div className={`${style.RegBlock} ${isVisible ? style.visibleForm : style.hiddenForm}`}>
      <h3 className={style.formTitle}>Реєстрація</h3>

      <div className={style.inputWrap}>
        <input
          className={style.input}
          placeholder="Прізвище"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
      {validate.lastName && <div className={style.error}>{validate.lastName}</div>}

      <div className={style.inputWrap}>
        <input
          className={style.input}
          placeholder="Ім’я"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>
      {validate.firstName && <div className={style.error}>{validate.firstName}</div>}

      <div className={style.inputWrap}>
        <input
          className={style.input}
          placeholder="По батькові"
          value={middleName}
          onChange={(e) => setMiddleName(e.target.value)}
        />
      </div>
      {validate.middleName && <div className={style.error}>{validate.middleName}</div>}

      <div className={style.inputWrap}>
        <input
          className={style.input}
          placeholder="Ваш email"
          type="email"
          value={gmail}
          onChange={(e) => setGmail(e.target.value)}
        />
      </div>
      {validate.gmail && <div className={style.error}>{validate.gmail}</div>}

      <div className={style.inputWrap}>
        <input
          className={style.input}
          placeholder="Пароль (мін. 8 символів)"
          type={showPass ? "text" : "password"}
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />
        <button
          type="button"
          className={style.toggleEye}
          onClick={() => setShowPass((v) => !v)}
          aria-label={showPass ? "Сховати пароль" : "Показати пароль"}
          tabIndex={-1}
        >
          {showPass ? "🙈" : "👁️"}
        </button>
      </div>
      {validate.pass && <div className={style.error}>{validate.pass}</div>}

      <button
        className={`${style.regBtn} ${style.btn}`}
        onClick={handleRegister}
        disabled={!isValid}
      >
        Зареєструватись
      </button>
    </div>
  );
}

/** ===== Helpers ===== */
function getPib() {
  const user = localStorage.getItem("user");
  if (!user) return null;
  try {
    const parsed = JSON.parse(user);
    return parsed?.PIB || parsed?.user?.PIB || null;
  } catch {
    return null;
  }
}

export { checkSignIn, SignInForm, RegisterForm, getPib };
