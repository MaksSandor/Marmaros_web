// routes/phoneVerify.js
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

// ===== in-memory storage: phone -> { code, expiresAt, sentAt }
const codes = new Map();

const normalizePhone = (p) => (p || "").replace(/[^\d+]/g, "").replace(/^00/, "+");
const genCode = () => Math.floor(100000 + Math.random() * 900000).toString();

// create (or reuse) nodemailer transporter with Ethereal test account
let transporterPromise = null;
async function getTransporter() {
  if (transporterPromise) return transporterPromise;

  // if you add real SMTP creds in .env, use them; else fall back to Ethereal
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporterPromise = Promise.resolve(
      nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: false,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      })
    );
  } else {
    transporterPromise = (async () => {
      const testAcc = await nodemailer.createTestAccount(); // free
      return nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: { user: testAcc.user, pass: testAcc.pass },
      });
    })();
  }
  return transporterPromise;
}

// 1) send code
router.post("/send-code", async (req, res) => {
  try {
    const { phone, channel = "test", email } = req.body || {};
    if (!phone) return res.status(400).json({ error: "Phone is required" });

    const normalized = normalizePhone(phone);

    // simple rate limit: 30s
    const existing = codes.get(normalized);
    const now = Date.now();
    if (existing && now - existing.sentAt < 30_000) {
      const wait = Math.ceil((30_000 - (now - existing.sentAt)) / 1000);
      return res.status(429).json({ error: `Зачекайте ${wait} c перед повторною відправкою` });
    }

    const code = genCode();
    const entry = { code, expiresAt: now + 5 * 60_000, sentAt: now };
    codes.set(normalized, entry);

    // channel: test (return code in response)
    if (channel === "test") {
      return res.json({
        message: "Код згенеровано (тестовий режим, SMS не відправляється)",
        phone: normalized,
        code,
        expiresInSec: 300,
      });
    }

    // channel: email — send code to email using Ethereal
    if (channel === "email") {
      if (!email) return res.status(400).json({ error: "Email is required for channel=email" });

      const transporter = await getTransporter();
      const info = await transporter.sendMail({
        from: '"Verify Bot" <no-reply@example.com>',
        to: email,
        subject: "Ваш код підтвердження",
        text: `Ваш код підтвердження: ${code} (діє 5 хвилин)`,
        html: `<p>Ваш код підтвердження: <b>${code}</b></p><p>Діє 5 хвилин.</p>`,
      });

      // Ethereal preview URL (клікни в браузері, лист безкоштовний)
      const previewUrl = nodemailer.getTestMessageUrl(info);

      return res.json({
        message: "Код надіслано на email (Ethereal)",
        phone: normalized,
        email,
        previewUrl, // відкрий, щоб побачити лист
        expiresInSec: 300,
      });
    }

    return res.status(400).json({ error: "Unsupported channel. Use 'test' or 'email'." });
  } catch (err) {
    console.error("send-code error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 2) verify code
router.post("/verify-code", (req, res) => {
  const { phone, code } = req.body || {};
  if (!phone || !code) return res.status(400).json({ error: "Phone and code are required" });

  const normalized = normalizePhone(phone);
  const entry = codes.get(normalized);

  if (!entry) return res.status(400).json({ error: "Код не запитувався або вже використаний" });
  if (Date.now() > entry.expiresAt) {
    codes.delete(normalized);
    return res.status(400).json({ error: "Код прострочений, надішліть новий" });
  }
  if (entry.code !== code) return res.status(400).json({ error: "Невірний код" });

  codes.delete(normalized);
  return res.json({ message: "Телефон підтверджено", phone: normalized, verified: true });
});

module.exports = router;
