// routes/reporteRoutes.js
const express = require("express");
const VentaController = require("../controllers/VentaController");

const router = express.Router();

router.get("/reporte-ventas", VentaController.reporteVentas);
router.get("/pedidos-por-estado", VentaController.pedidosPorEstado);
router.get(
  "/cantidad-ventas-por-sushi",
  VentaController.cantidadVentasPorSushi
);

module.exports = router;
