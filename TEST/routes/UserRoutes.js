const express = require("express");
const router = express.Router();
const Usuario = require("../models/User");

// GET: Obtener todos los usuarios
router.get("/", async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener usuarios", error: error.message });
  }
});

// POST: Crear un nuevo usuario
router.post("/", async (req, res) => {
  try {
    const { nombre, email } = req.body;
    const nuevoUsuario = new Usuario({ nombre, email });
    await nuevoUsuario.save();

    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res
      .status(400)
      .json({ mensaje: "Error al crear usuario", error: error.message });
  }
});

module.exports = router;
