const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// Registro
router.post("/register", async (req, res) => {
  try {
    const { email, senha } = req.body;
    const hashedSenha = await bcrypt.hash(senha, 10);

    const novoUsuario = new User({ email, senha: hashedSenha });
    await novoUsuario.save();

    res.status(201).json({ mensagem: "Usuário criado com sucesso!" });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao registrar usuário." });
  }
});

module.exports = router;
const jwt = require("jsonwebtoken");

// ...dentro do router.post('/login')
const token = jwt.sign(
  { id: usuario._id },
  process.env.JWT_SECRET,
  { expiresIn: "1h" } // Token expira em 1 hora
);

res.status(200).json({
  mensagem: "Login bem-sucedido!",
  token: token,
});
