import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../headerImg/header";

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
    <div>
      <Header />
      <div style={{ padding: "30px", textAlign: "center" }}>
        <h1>Профіль користувача</h1>
        <p><strong>ПІБ:</strong> {user.PIB}</p>
        <p><strong>Email:</strong> {user.gmail}</p>
        <button
          onClick={handleLogout}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            fontSize: "18px",
            backgroundColor: "black",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            transition: "0.3s"
          }}
        >
          Вийти
        </button>
      </div>
    </div>
  );
}

export default Profile;
