const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ erro: "Usuário não encontrado." });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ erro: "Senha incorreta." });
    }

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      mensagem: "Login bem-sucedido!",
      token: token,
    });
  } catch (err) {
    res.status(500).json({ erro: "Erro no login." });
  }
});

module.exports = router;
