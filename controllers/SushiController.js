// controllers/sushiController.js
const Sushi = require("../models/Sushi");

// Crear un nuevo sushi
exports.crearSushi = async (req, res) => {
  try {
    const { nombre, descripcion, precio, imagen, ingredientes, disponible } =
      req.body;

    const nuevoSushi = new Sushi({
      nombre,
      descripcion,
      precio,
      imagen,
      ingredientes,
      disponible,
    });

    await nuevoSushi.save();
    res.status(201).json(nuevoSushi);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el sushi", error });
  }
};

// Obtener todos los sushis
exports.obtenerSushis = async (req, res) => {
  try {
    const sushis = await Sushi.find();
    res.status(200).json(sushis);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los sushis", error });
  }
};

// Obtener un sushi por ID
exports.obtenerSushiPorId = async (req, res) => {
  try {
    const sushi = await Sushi.findById(req.params.id);
    if (!sushi) {
      return res.status(404).json({ message: "Sushi no encontrado" });
    }
    res.status(200).json(sushi);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el sushi", error });
  }
};

// Actualizar un sushi por ID
exports.actualizarSushi = async (req, res) => {
  try {
    const { nombre, descripcion, precio, imagen, ingredientes, disponible } =
      req.body;
    const sushiActualizado = await Sushi.findByIdAndUpdate(
      req.params.id,
      { nombre, descripcion, precio, imagen, ingredientes, disponible },
      { new: true }
    );

    if (!sushiActualizado) {
      return res.status(404).json({ message: "Sushi no encontrado" });
    }
    res.status(200).json(sushiActualizado);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el sushi", error });
  }
};

// Eliminar un sushi por ID
exports.eliminarSushi = async (req, res) => {
  try {
    const sushiEliminado = await Sushi.findByIdAndDelete(req.params.id);
    if (!sushiEliminado) {
      return res.status(404).json({ message: "Sushi no encontrado" });
    }
    res.status(200).json({ message: "Sushi eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el sushi", error });
  }
};
