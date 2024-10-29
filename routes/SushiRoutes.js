// routes/sushiRoutes.js
const express = require("express");
const router = express.Router();
const SushiController = require("../controllers/SushiController");

router.post("/sushis", SushiController.crearSushi);
router.get("/sushis", SushiController.obtenerSushis);
router.get("/sushis/:id", SushiController.obtenerSushiPorId);
router.put("/sushis/:id", SushiController.actualizarSushi);
router.delete("/sushis/:id", SushiController.eliminarSushi);

module.exports = router;
