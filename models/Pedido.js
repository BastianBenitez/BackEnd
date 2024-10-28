// models/Pedido.js
const mongoose = require("mongoose");

const pedidoSchema = new mongoose.Schema({
  sushis: [
    {
      sushi: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sushi", // Referencia al modelo Sushi
        required: true,
      },
      cantidad: {
        type: Number,
        required: true,
      },
    },
  ],
  total: {
    type: Number,
    required: true,
  },
  cliente: {
    type: String,
    required: true,
  },
  estado: {
    type: String,
    enum: ["pendiente", "en proceso", "completado", "cancelado"],
    default: "pendiente",
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
});

const Pedido = mongoose.model("Pedido", pedidoSchema);
module.exports = Pedido;
