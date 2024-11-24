// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const UsuarioController = require("../controllers/UsuarioController");

router.get("/", UsuarioController.getUsers); // Obtener todos los usuarios
router.get("/:id", UsuarioController.getUserById); // Obtener un usuario por ID
router.put("/:id", UsuarioController.updateUser); // Actualizar un usuario por ID
router.delete("/:id", UsuarioController.deleteUser); // Eliminar un usuario por ID
router.put("/switch-role-admin/:id", UsuarioController.switchRoleAdmin);
router.post("/agregar-pedido", UsuarioController.agregarPedidoAHistorial);

module.exports = router;
