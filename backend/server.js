const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");

dotenv.config();
const app = express();

app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Conectado ao MongoDB"))
  .catch((err) => console.error("❌ Erro MongoDB:", err));

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Backend funcionando!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando na porta ${PORT}`);
});

const path = require("path");

// Serve arquivos estáticos (frontend)
app.use(express.static(path.join(__dirname, "frontend")));

const emocaoRoutes = require("./routes/emocoes");
app.use("/api/emocoes", emocaoRoutes);
