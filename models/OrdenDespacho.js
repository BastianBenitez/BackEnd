const mongoose = require("mongoose");

const OrdenDespachoSchema = new mongoose.Schema({
  orden_despacho_id: { type: String, required: true },
  fecha: { type: Date, required: true },
  costo: { type: Number, required: true },
  usuario: { type: String, required: true },
  repartidor: { type: String },
  direccion: { type: String, required: true },
  estado: { type: String, required: true },
  productos: [
    {
      producto_id: String,
      nombre: String,
      cantidad: Number,
      valor_unitario: Number,
      total: Number,
    },
  ],
  tipo_entrega: { type: String, required: true }, // "para llevar" o "delivery"
});

module.exports = mongoose.model("OrdenDespacho", OrdenDespachoSchema);
