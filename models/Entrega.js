const mongoose = require("mongoose");

const EntregaSchema = new mongoose.Schema(
  {
    pedido_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pedido",
      required: true,
    },
    fecha: {
      type: Date,
      required: true,
      default: Date.now,
    },
    repartidor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    estado_entrega: {
      type: String,
      required: true,
      enum: ["En camino", "Entregado", "Cancelado"],
    },
    costo_entrega: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Entrega", EntregaSchema);
