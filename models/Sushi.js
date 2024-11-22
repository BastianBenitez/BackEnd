// models/Sushi.js
const mongoose = require("mongoose");

const sushiSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    descripcion: {
      type: String,
      required: true,
    },
    precio: {
      type: Number,
      required: true,
    },
    url: {
      type: String, // URL de la imagen del sushi
      required: true,
    },
    disponible: {
      type: Boolean,
      default: true, // Indica si el sushi está disponible
    },
  },
  {
    timestamps: true, // Añade createdAt y updatedAt
  }
);

const Sushi = mongoose.model("Sushi", sushiSchema);
module.exports = Sushi;
