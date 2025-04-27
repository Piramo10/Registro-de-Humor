const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Garante que o usuário é único
  },
  email: {
    type: String,
    required: true,
    unique: true, // Garante que o email é único
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
