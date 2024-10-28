// models/ReporteVentas.js
const mongoose = require("mongoose");

const reporteVentasSchema = new mongoose.Schema({
  fecha: {
    type: Date,
    default: Date.now,
  },
  totalVentas: {
    type: Number,
    required: true,
  },
  detalles: [
    {
      sushi: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sushi",
        required: true,
      },
      cantidadVendida: {
        type: Number,
        required: true,
      },
      ingresoTotal: {
        type: Number,
        required: true,
      },
    },
  ],
});

const ReporteVentas = mongoose.model("ReporteVentas", reporteVentasSchema);
module.exports = ReporteVentas;
