const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors"); // importando o cors
const authRoutes = require("./routes/authRoutes"); // ou auth dependendo do nome

dotenv.config();

const app = express();

app.use(cors()); // habilitando CORS antes das rotas
app.use(express.json()); // permite receber JSON

// Conectar ao MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("🟢 Conectado ao MongoDB"))
  .catch((err) => console.error("🔴 Erro ao conectar no MongoDB:", err));

// Usar as rotas de auth
app.use("/api/auth", authRoutes); // sua rota de auth

// Iniciar o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
