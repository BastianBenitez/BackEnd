const mongoose = require("mongoose");

const PedidoSchema = new mongoose.Schema({
  pedido_id: { type: String, required: true },
  fecha: { type: Date, required: true },
  cliente: { type: String },
  productos: [
    {
      producto_id: String,
      cantidad: Number,
      valor_unitario: Number,
      subtotal: Number,
    },
  ],
  estado: { type: String, required: true }, // "En preparación", "Listo", "Entregado"
  tipo_entrega: { type: String, required: true }, // "para llevar" o "delivery"
  costo_envio: { type: Number, default: 0 },
  total: { type: Number, required: true },
});

module.exports = mongoose.model("Pedido", PedidoSchema);
