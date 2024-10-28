const mongoose = require("mongoose");

const UsuarioSchema = new mongoose.Schema({
  usuario_id: { type: String, required: true },
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  correo: { type: String, required: true },
  telefono: { type: String },
  direccion: { type: String },
  rol: { type: String, required: true }, // "dueño", "administrador", "cajero", "cliente", "encargado despachos"
  estado: { type: String, required: true }, // "activo" o "inactivo"
  actividades_autorizadas: [{ type: String }],
});

module.exports = mongoose.model("Usuario", UsuarioSchema);
