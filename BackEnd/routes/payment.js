// routes/payments.js
const express = require("express");
const axios = require("axios");
const crypto = require("crypto");

const router = express.Router();

const FONDY_MERCHANT_ID = process.env.FONDY_MERCHANT_ID;
const FONDY_SECRET = process.env.FONDY_SECRET;
const BASE_URL = process.env.BASE_URL || "http://localhost:3001";

/**
 * Підпис Fondy:
 * sha1( secret | значення_параметрів_за_алфавітом (непорожні) )
 * Працює як для запиту, так і для перевірки колбеку.
 */
function fondySign(params) {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "");
  const sortedValues = entries.sort(([a], [b]) => a.localeCompare(b)).map(([, v]) => String(v));
  const base = [FONDY_SECRET, ...sortedValues].join("|");
  return crypto.createHash("sha1").update(base).digest("hex");
}

/**
 * POST /payments/fondy
 * Body: { order_id?: string, amount: number, currency?: "UAH", order_desc?: string }
 * amount — у гривнях (ми самі множимо на 100)
 * Відповідь: { url: "https://pay.fondy.eu/..." }
 */
router.post("/fondy", async (req, res) => {
  try {
    const { order_id, amount, currency = "UAH", order_desc = "Оплата замовлення" } = req.body || {};
    if (!amount) return res.status(400).json({ error: "amount обов'язковий (грн)" });

    const request = {
      merchant_id: FONDY_MERCHANT_ID,
      order_id: order_id || `order_${Date.now()}`,
      order_desc,
      currency,
      amount: Math.round(Number(amount) * 100), // копійки
      response_url: `${BASE_URL}/payments/success`,              // куди повернуть користувача
      server_callback_url: `${BASE_URL}/payments/fondy-callback` // бекенд-підтвердження
    };

    request.signature = fondySign(request);

    const { data } = await axios.post(
      "https://pay.fondy.eu/api/checkout/url/",
      { request },
      { headers: { "Content-Type": "application/json" } }
    );

    if (data?.response?.checkout_url) {
      return res.json({ url: data.response.checkout_url });
    }
    return res.status(400).json({ error: "Fondy не повернув checkout_url", fondy: data });
  } catch (e) {
    console.error("Fondy create error:", e);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * Колбек від Fondy (підтвердження платежу)
 * Fondy шле application/x-www-form-urlencoded
 */
router.post("/fondy-callback", express.urlencoded({ extended: false }), (req, res) => {
  try {
    const body = req.body || {};
    const { signature, ...rest } = body;

    const expected = fondySign(rest);
    if (signature !== expected) {
      console.error("❌ Невірний підпис Fondy");
      return res.sendStatus(400);
    }

    if (body.order_status === "approved") {
      // TODO: тут онови замовлення у БД за body.order_id як "paid"
      console.log(`✅ Оплачено: order_id=${body.order_id}, amount=${body.amount} ${body.currency}`);
    } else {
      console.log(`ℹ️ Статус ${body.order_status} для order_id=${body.order_id}`);
    }

    res.sendStatus(200); // обов'язково 200
  } catch (e) {
    console.error("fondy-callback error:", e);
    res.sendStatus(500);
  }
});
// сторінка "успіх" — приймаємо і GET, і POST
router.get("/success", (req, res) => {
  res.send("Оплата пройшла успішно ✅ (GET)");
});

router.post("/success", express.urlencoded({ extended: false }), (req, res) => {
  // якщо Fondy шле POST-редірект із параметрами форми
  // тут req.body може містити order_id, amount, currency тощо
  res.send("Оплата пройшла успішно ✅");
});

// опціонально
router.get("/cancel", (_req, res) => res.send("Оплату скасовано ❌"));


// опційні сторінки успіх/відміна (щоб щось повернути юзеру)
router.get("/success", (_req, res) => res.send("Оплата пройшла успішно ✅"));
router.get("/cancel", (_req, res) => res.send("Оплату скасовано ❌"));

module.exports = router;
