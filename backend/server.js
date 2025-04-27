const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes"); // ou auth dependendo do nome

dotenv.config();

const app = express();
app.use(express.json()); // Certifique-se de que isso está configurado para permitir JSON

// Conectar ao MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("🟢 Conectado ao MongoDB"))
  .catch((err) => console.error("🔴 Erro ao conectar no MongoDB:", err));

// Usar as rotas
app.use("/api/auth", authRoutes); // Esta linha deve estar presente

// Iniciar o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
