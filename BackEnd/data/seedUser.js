require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User'); // або правильний шлях у твоєму проєкті

async function createUser() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  const newUser = new User({
    PIB: 'Іваненко Іван Іванович',
    gmail: 'example@gmail.com',
    password: 'hashedPasswordHere',
    verification: false
  });

  await newUser.save();
  console.log('✅ User created');

  mongoose.disconnect();
}

createUser().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
