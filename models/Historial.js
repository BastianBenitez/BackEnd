const mongoose = require("mongoose");

const HistorialSchema = new mongoose.Schema(
  {
    historial_id: {
      type: String,
      required: true,
      unique: true, // Asegura que cada historial sea único
    },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario", // Suponiendo que tienes un modelo Usuario
      required: true,
    },
    orden_despacho: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrdenDespacho", // Suponiendo que tienes un modelo OrdenDespacho
      required: true,
    },
    fecha: {
      type: Date,
      required: true,
      default: Date.now, // Agrega una fecha por defecto
    },
    estado: {
      type: String,
      required: true,
      enum: ["pendiente", "completado", "cancelado"], // Limita los estados posibles
    },
    comentarios: {
      type: String,
      trim: true, // Elimina espacios en blanco al inicio y al final
    },
  },
  {
    timestamps: true, // Añade createdAt y updatedAt automáticamente
  }
);

module.exports = mongoose.model("Historial", HistorialSchema);
