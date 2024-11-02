// controllers/authController.js
const Usuario = require("../models/Usuario"); // Asegúrate de importar tu modelo
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Clave secreta para firmar los tokens JWT
const SECRET_KEY = "tu_clave_secreta"; // Cambia esto a una clave más segura y mantenla en un archivo .env

// Registro de nuevo usuario
const registerUser = async (req, res) => {
  const { nombre, apellido, email, telefono, direccion, contrasena } = req.body;

  // Validar si el usuario ya existe
  const existingUser = await Usuario.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "El usuario ya existe" });
  }

  // Hashear la contraseña
  const hashedPassword = await bcrypt.hash(contrasena, 10);

  // Crear un nuevo usuario, inicializando isAdmin en false
  const newUser = new Usuario({
    nombre,
    apellido,
    email,
    telefono,
    direccion,
    contrasena: hashedPassword,
    isAdmin: false, // Inicializar isAdmin en false
  });

  await newUser.save();

  res.status(201).json({ message: "Usuario creado exitosamente" });
};

// Autenticación de usuario
const loginUser = async (req, res) => {
  const { email, contrasena } = req.body;

  // Buscar usuario por email
  const user = await Usuario.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  // Verificar la contraseña
  const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  // Generar el token JWT
  const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, {
    expiresIn: "1h",
  });

  res.json({ token });
};

module.exports = {
  registerUser,
  loginUser,
};
