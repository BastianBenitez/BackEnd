// index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

// Configuración de la aplicacion
const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(bodyParser.json());
mongoose.set("strictQuery", true);

// Conexion a MongoDB
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Conexión exitosa a MongoDB Atlas"))
  .catch((error) => console.error("Error al conectar a MongoDB Atlas:", error));

// Importacion de modelos
const Venta = require("./models/Venta");
const Pedido = require("./models/Pedido");

// Importación de rutas
const ventasRoutes = require("./routes/ventas");
const pedidosRoutes = require("./routes/pedidos");

// Usar rutas
app.use("/api/ventas", ventasRoutes);
app.use("/api/pedidos", pedidosRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
