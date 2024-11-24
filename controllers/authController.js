// controllers/authController.js
const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "tu_clave_secreta";

// Registro de nuevo usuario
const registerUser = async (req, res) => {
  const { nombre, apellido, email, telefono, direccion, contrasena } = req.body;

  const existingUser = await Usuario.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "El usuario ya existe" });
  }

  const hashedPassword = await bcrypt.hash(contrasena, 10);

  const newUser = new Usuario({
    nombre,
    apellido,
    email,
    telefono,
    direccion,
    contrasena: hashedPassword,
    isAdmin: false,
    isowner: false,
  });

  await newUser.save();

  res.status(201).json({ message: "Usuario creado exitosamente" });
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
    SECRET_KEY,
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
