// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const UsuarioController = require("../controllers/UsuarioController");

router.get("/", UsuarioController.getUsers); // Obtener todos los usuarios
router.get("/:id", UsuarioController.getUserById); // Obtener un usuario por ID
router.post("/", UsuarioController.createUser); // Crear un nuevo usuario
router.put("/:id", UsuarioController.updateUser); // Actualizar un usuario por ID
router.delete("/:id", UsuarioController.deleteUser); // Eliminar un usuario por ID

module.exports = router;
