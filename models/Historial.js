const mongoose = require("mongoose");

const HistorialSchema = new mongoose.Schema({
  historial_id: { type: String, required: true },
  usuario: { type: String, required: true },
  orden_despacho: { type: String, required: true },
  fecha: { type: Date, required: true },
  estado: { type: String, required: true },
  comentarios: { type: String },
});

module.exports = mongoose.model("Historial", HistorialSchema);
