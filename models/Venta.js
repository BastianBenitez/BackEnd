const mongoose = require("mongoose");

const VentaSchema = new mongoose.Schema({
  venta_id: { type: String, required: true },
  fecha: { type: Date, required: true },
  total: { type: Number, required: true },
  cajero: { type: String, required: true },
  cliente: { type: String },
  productos: [
    {
      producto_id: String,
      nombre: String,
      cantidad: Number,
      valor_unitario: Number,
      subtotal: Number,
    },
  ],
  metodo_pago: { type: String, required: true },
  vuelto: { type: Number },
  tipo_venta: { type: String, required: true }, // "en local" o "para llevar"
});

module.exports = mongoose.model("Venta", VentaSchema);
