const mongoose = require("mongoose");

const ReporteVentasSchema = new mongoose.Schema({
  reporte_id: { type: String, required: true },
  fecha_inicio: { type: Date, required: true },
  fecha_fin: { type: Date, required: true },
  ventas_totales: { type: Number, required: true },
  numero_ventas: { type: Number, required: true },
  detalles_ventas: [
    {
      venta_id: String,
      total: Number,
      tipo_venta: String,
    },
  ],
  cajero: { type: String, required: true },
});

module.exports = mongoose.model("ReporteVentas", ReporteVentasSchema);
