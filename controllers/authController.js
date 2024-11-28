// controllers/authController.js
const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Registro de nuevo usuario
const registerUser = async (req, res) => {
  try {
    const { nombre, apellido, email, telefono, direccion, contrasena } =
      req.body;

    // Validar campos requeridos
    if (!email || !contrasena || !nombre || !apellido) {
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }

    // Verificar si el usuario existe
    const existingUser = await Usuario.findOne({ email }).lean();
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // Validaciones
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({ message: "Formato de email inválido" });
    }

    if (contrasena.length < 8) {
      return res
        .status(400)
        .json({ message: "La contraseña debe tener al menos 8 caracteres" });
    }

    // Sanitización y preparación de datos
    const userData = {
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      email: email.toLowerCase().trim(),
      telefono: telefono?.trim(),
      direccion: direccion?.trim(),
      isAdmin: false,
      isOwner: false,
    };

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(12);
    userData.contrasena = await bcrypt.hash(contrasena, salt);

    // Crear usuario
    await Usuario.create(userData);

    return res.status(201).json({ message: "Usuario creado exitosamente" });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return res.status(500).json({ message: "Error al crear el usuario" });
  }
};

const loginUser = async (req, res) => {
  const { email, contrasena } = req.body;

  const user = await Usuario.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  // Generar el token JWT
  const token = jwt.sign(
    {
      id: user._id,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      telefono: user.telefono,
      direccion: user.direccion,
      isAdmin: user.isAdmin,
      isOwner: user.isOwner,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );

  // Responder con el token y los datos del usuario
  res.json({
    message: "Inicio de sesión exitoso",
    token, // Envía el token en el cuerpo de la respuesta
    user: {
      id: user._id,
      email: user.email,
      nombre: user.nombre,
      isAdmin: user.isAdmin,
      isOwner: user.isOwner,

      // Agrega cualquier otro dato necesario
    },
  });
};

module.exports = {
  registerUser,
  loginUser,
};
