// index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// Configuración de la aplicacion
const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Cambia esto a tu frontend
    credentials: true, // Permite el uso de cookies
  })
);
app.use(bodyParser.json());
app.use(cookieParser());
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
const SushiRoutes = require("./routes/SushiRoutes");
const UsuarioRoutes = require("./routes/UsuarioRoutes");
const authRoutes = require("./routes/authRoutes");

// Usar rutas
app.use("/api", SushiRoutes);
app.use("/api/users", UsuarioRoutes);
app.use("/api/auth", authRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
