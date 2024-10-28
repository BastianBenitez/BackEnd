const mongoose = require("mongoose");

const EntregaSchema = new mongoose.Schema({
  entrega_id: { type: String, required: true },
  pedido_id: { type: String, required: true },
  fecha: { type: Date, required: true },
  repartidor: { type: String, required: true },
  estado_entrega: { type: String, required: true }, // "En camino", "Entregado"
  costo_entrega: { type: Number },
});

module.exports = mongoose.model("Entrega", EntregaSchema);
