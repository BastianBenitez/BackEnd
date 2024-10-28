// models/Venta.js
const mongoose = require("mongoose");

const ventaSchema = new mongoose.Schema({
  sushi: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sushi", // Referencia al modelo Sushi
    required: true,
  },
  cantidad: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
});

const Venta = mongoose.model("Venta", ventaSchema);
module.exports = Venta;
