import React, { useState, useEffect } from "react";
import style from "./accStyle.module.css";

function checkSignIn() {
  return !!localStorage.getItem("user");
}

function SignInForm({ isVisible }) {
  const [gmail, setGmail] = useState("");
  const [pass, setPass] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/users')
      .then(response => {
        if (!response.ok) {
          throw new Error('Помилка при завантаженні користувачів');
        }
        return response.json();
      })
      .then(data => {
        setUsers(data);
      })
      .catch(err => console.error("Fetch error:", err));
  }, []);

  const GmailChange = (event) => {
    setGmail(event.target.value);
  }

  const PassChange = (event) => {
    setPass(event.target.value);
  }

  const Login = () => {
    const found = users.find(u => u.gmail === gmail && u.pass === pass);

    if (found) {
      localStorage.setItem("user", JSON.stringify(found));
      alert("Вхід успішний!");
      window.location.reload(); // або закрий форму
    } else {
      alert("Неправильний email або пароль");
    }
  };

  return (
    <div className={`${style.SignBlock} ${isVisible ? style.visibleForm : style.hiddenForm}`}>
      <input className={style.gmailInput} placeholder="Ваш email" onChange={GmailChange} />
      <input className={style.passInput} placeholder="Пароль" type="password" onChange={PassChange} />
      <button className={style.SignInBtn} onClick={Login}>Увійти</button>
    </div>
  )
}

function RegisterForm({ isVisible }) {
  const [pib, setPib] = useState("");
  const [gmail, setGmail] = useState("");
  const [pass, setPass] = useState("");

  const handlePibChange = (e) => setPib(e.target.value);
  const handleGmailChange = (e) => setGmail(e.target.value);
  const handlePassChange = (e) => setPass(e.target.value);

  const handleRegister = () => {
    if (!pib || !gmail || !pass) {
      alert("Заповніть всі поля!");
      return;
    }

    const newUser = { pib, gmail, pass };

    fetch('http://localhost:3001/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Помилка під час реєстрації');
        }
        return response.json();
      })
      .then(data => {
        alert("Реєстрація успішна!");
        // Можеш зразу залогінити користувача:
        localStorage.setItem("user", JSON.stringify(data));
        window.location.reload();
      })
      .catch(error => {
        console.error(error);
        alert("Щось пішло не так при реєстрації!");
      });
  };

  return (
    <div className={`${style.RegBlock} ${isVisible ? style.visibleForm : style.hiddenForm}`}>
      <input className={style.Pib} placeholder="Ваше ПІБ" value={pib} onChange={handlePibChange} />
      <input className={style.gmailInput} placeholder="Ваш email" value={gmail} onChange={handleGmailChange} />
      <input className={style.passInput} placeholder="Пароль" type="password" value={pass} onChange={handlePassChange} />
      <button className={style.regBtn} onClick={handleRegister}>Зареєструватись</button>
    </div>
  )
}


export { checkSignIn, SignInForm, RegisterForm };
