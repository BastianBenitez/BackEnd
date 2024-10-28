const mongoose = require("mongoose");

const ProductoSchema = new mongoose.Schema(
  {
    productoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sushi", // Suponiendo que tienes un modelo Sushi
      required: true,
    },
    nombre: {
      type: String,
      required: true,
    },
    cantidad: {
      type: Number,
      required: true,
      min: 1, // Asegura que la cantidad sea al menos 1
    },
    valor_unitario: {
      type: Number,
      required: true,
      min: 0, // Asegura que el valor unitario no sea negativo
    },
    total: {
      type: Number,
      required: true,
      min: 0, // Asegura que el total no sea negativo
    },
  },
  { _id: false }
); // Desactiva la creación de un _id para subdocumentos

const OrdenDespachoSchema = new mongoose.Schema(
  {
    orden_despacho_id: {
      type: String,
      required: true,
      unique: true, // Asegura que cada orden de despacho sea única
    },
    fecha: {
      type: Date,
      required: true,
      default: Date.now, // Agrega una fecha por defecto
    },
    costo: {
      type: Number,
      required: true,
      min: 0, // Asegura que el costo no sea negativo
    },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario", // Suponiendo que tienes un modelo Usuario
      required: true,
    },
    repartidor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Repartidor", // Suponiendo que tienes un modelo Repartidor
    },
    direccion: {
      type: String,
      required: true,
    },
    estado: {
      type: String,
      required: true,
      enum: ["pendiente", "en camino", "entregado", "cancelado"], // Limita los estados posibles
    },
    productos: [ProductoSchema], // Usando el esquema de producto definido arriba
    tipo_entrega: {
      type: String,
      required: true,
      enum: ["para llevar", "delivery"], // Limita los tipos de entrega posibles
    },
  },
  {
    timestamps: true, // Añade createdAt y updatedAt automáticamente
  }
);

module.exports = mongoose.model("OrdenDespacho", OrdenDespachoSchema);
