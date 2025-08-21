// src/utils/favorites.js
const LS_KEY = "favorites";

/** Зчитати список улюблених (масив рядків) */
export function getFavs() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.map(String) : [];
  } catch {
    return [];
  }
}

/** Зберегти масив улюблених */
function setFavs(list) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(Array.from(new Set(list.map(String)))));
  } catch {}
}

/** Чи є ключ у вибраному */
export function isFav(key) {
  const k = String(key);
  return getFavs().includes(k);
}

/** Перемкнути стан улюбленого для ключа й повернути поточний стан (true/false) */
export function toggleFav(key) {
  const k = String(key);
  const list = getFavs();
  const idx = list.indexOf(k);
  if (idx >= 0) list.splice(idx, 1);
  else list.push(k);
  setFavs(list);
  return list.includes(k);
}

/** Кількість улюблених */
export function countFavs() {
  return getFavs().length;
}
