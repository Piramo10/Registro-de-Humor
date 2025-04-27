const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Emoção = require("../models/Emocao");
dotenv.config();

// Middleware para verificar token JWT
function autenticarToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ erro: "Token não encontrado" });

  jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
    if (err) return res.status(403).json({ erro: "Token inválido" });
    req.usuario = usuario;
    next();
  });
}

// Rota para registrar uma emoção
router.post("/registrar", autenticarToken, async (req, res) => {
  const { emocao } = req.body;

  try {
    const novaEmocao = new Emoção({
      usuario: req.usuario.id,
      emocao: emocao,
      data: new Date(),
    });

    await novaEmocao.save();
    res.status(201).json({ mensagem: "Emoção registrada com sucesso!" });
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao registrar emoção" });
  }
});

// Rota para listar emoções do usuário
router.get("/", autenticarToken, async (req, res) => {
  try {
    const emocoes = await Emoção.find({ usuario: req.usuario.id }).sort({
      data: -1,
    });
    res.json(emocoes);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao buscar emoções" });
  }
});

module.exports = router;
