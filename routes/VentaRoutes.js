// routes/reporteRoutes.js
const express = require("express");
const VentaController = require("../controllers/VentaController");

const router = express.Router();

router.get("/reporte-ventas", VentaController.reporteVentasTotalesPorMes);
router.get(
  "/cantidad-ventas-por-sushi",
  VentaController.cantidadVentasPorSushi
);
router.get("/pedidos-sushi-per-month", VentaController.getSushiSalesByMonth);

module.exports = router;
