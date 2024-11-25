// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const UsuarioController = require("../controllers/UsuarioController");

router.get("/", UsuarioController.obtenerUsuarios); // Obtener todos los usuarios
router.get("/:id", UsuarioController.obterUsuarioPorId); // Obtener un usuario por ID
router.put("/:id", UsuarioController.actualizarUsuarios); // Actualizar un usuario por ID
router.delete("/:id", UsuarioController.eliminarUsuario); // Eliminar un usuario por ID
router.put("/switch-role-admin/:id", UsuarioController.cambiarRolAdmin);
router.post("/agregar-pedido", UsuarioController.agregarPedidoAHistorial);

module.exports = router;
