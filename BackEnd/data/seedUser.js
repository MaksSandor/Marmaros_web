require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const users = [
  {
    PIB: "Іваненко Іван Іванович",
    gmail: "ivan@gmail.com",
    password: "ivan123",
    verification: false
  },
  {
    PIB: "Петренко Петро Петрович",
    gmail: "petro@gmail.com",
    password: "petro123",
    verification: true
  },
  {
    PIB: "Коваль Ольга Олегівна",
    gmail: "olga@gmail.com",
    password: "olga123",
    verification: false
  },
  {
    PIB: "Сидоренко Сергій Сергійович",
    gmail: "sergiy@gmail.com",
    password: "sergiy123",
    verification: true
  },
  {
    PIB: "Мельник Марія Миколаївна",
    gmail: "maria@gmail.com",
    password: "maria123",
    verification: false
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  await User.deleteMany({});
  console.log('🗑️ Old users removed');

  await User.insertMany(users);
  console.log('✅ New users seeded');

  process.exit();
}

seed().catch(err => {
  console.error('❌ Error seeding users:', err);
  process.exit(1);
});
