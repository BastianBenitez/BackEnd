const express = require("express");
const router = express.Router();
const pedidoController = require("../controllers/PedidoController");

router.post("/", pedidoController.crearPedido);
router.get("/", pedidoController.obtenerPedidos);
router.get("/:id", pedidoController.obtenerPedidoPorId);
router.put("/:id", pedidoController.actualizarEstadoPedido);
router.delete("/:id", pedidoController.eliminarPedido);
router.put("/cancel/:id", pedidoController.cancelOrder);
router.get("/datails/:id", pedidoController.getOrderDetails);

module.exports = router;
