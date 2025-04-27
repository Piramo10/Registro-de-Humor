const mongoose = require("mongoose");

const emocaoSchema = new mongoose.Schema({
  sentimento: {
    type: String,
    required: true,
  },
  intensidade: {
    type: Number,
    required: true,
  },
  data: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
});

module.exports = mongoose.model("Emocao", emocaoSchema);
