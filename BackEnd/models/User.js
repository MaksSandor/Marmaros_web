const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  PIB: {
    type: String,
    required: true
  },
  gmail: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  verification: {
    type: Boolean,
    default: false
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
