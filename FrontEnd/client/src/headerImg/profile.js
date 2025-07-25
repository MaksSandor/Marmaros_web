import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../headerImg/header";
import style from "./profileStyle.module.css";
import userPh from "./user.png";

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Отримуємо користувача з localStorage
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      // Якщо збережений обʼєкт має ключ user — беремо його (після реєстрації)
      setUser(parsed.user ? parsed.user : parsed);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/"); // Повертаємось на головну
    window.location.reload(); // Щоб header оновився і показав кнопки "Увійти"
  };

  if (!user) {
    return (
      <div>
        <Header />
        <h2>Користувач не знайдений. Увійдіть в акаунт.</h2>
      </div>
    );
  }

  return (
    <div className={style.bg}>
      <Header />
      <div className={style.Container}>
        <img src={userPh} className={style.userPh}/>
        <h1>Профіль користувача</h1>
        <p><strong>ПІБ:</strong> {user.PIB}</p>
        <p><strong>Email:</strong> {user.gmail}</p>
        <button
          onClick={handleLogout}
          className={style.logOutBtn}>
          Вийти
        </button>
      </div>
    </div>
  );
}

export default Profile;
