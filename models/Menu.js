const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema({
  menu_id: { type: String, required: true },
  fecha: { type: Date, required: true },
  productos: [
    {
      producto_id: String,
      nombre: String,
      valor: Number,
      descripcion: String,
    },
  ],
});

module.exports = mongoose.model("Menu", MenuSchema);
