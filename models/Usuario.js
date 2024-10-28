// models/Usuario.js
const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    apellido: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    telefono: {
      type: String,
      required: true,
    },
    direccion: {
      type: String,
      required: true,
    },
    contrasena: {
      type: String,
      required: true,
    },
    fechaRegistro: {
      type: Date,
      default: Date.now,
    },
    isAdmin: {
      type: Boolean,
      default: false, // Indica si el usuario tiene privilegios de administrador
    },
    historialPedidos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pedido", // Referencia al modelo Pedido
      },
    ],
  },
  {
    timestamps: true, // Añade createdAt y updatedAt
  }
);

// Crea un índice para asegurar que el email sea único
usuarioSchema.index({ email: 1 });

const Usuario = mongoose.model("Usuario", usuarioSchema);
module.exports = Usuario;
