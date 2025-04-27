const authMiddleware = require("../middlewares/authMiddleware");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// Rota de registro
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  const userExists = await User.findOne({ username });
  if (userExists) {
    return res.status(400).json({ message: "Usuário já existe" });
  }

  const emailExists = await User.findOne({ email });
  if (emailExists) {
    return res.status(400).json({ message: "Email já está em uso" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
  } catch (error) {
    console.error("Erro de servidor:", error);
    res
      .status(500)
      .json({ message: "Erro ao cadastrar usuário", error: error.message });
  }
});

// Rota de login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: "Usuário não encontrado" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Senha incorreta" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({
    message: "Login bem-sucedido!",
    token: token,
  });
});

// Rota protegida que retorna o perfil do usuário
router.get("/profile", authMiddleware, (req, res) => {
  // Acesso ao ID do usuário autenticado
  res.json({
    message: "Perfil do usuário acessado com sucesso!",
    userId: req.userId,
  });
});

module.exports = router;
