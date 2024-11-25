// routes/reporteRoutes.js
const express = require("express");
const VentaController = require("../controllers/VentaController");

const router = express.Router();

router.get(
  "/pedidos-sushi-per-month",
  VentaController.obtenerVetasShushoPorMes
);
router.get(
  "/cantidad-ventas-por-sushi",
  VentaController.cantidadVentasPorSushi
);
router.get("/reporte-ventas", VentaController.reporteVentasTotalesPorMes);

module.exports = router;
