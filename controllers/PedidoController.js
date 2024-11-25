const Pedido = require("../models/Pedido");
const Sushi = require("../models/Sushi");
const User = require("../models/Usuario");

// Crear un nuevo pedido
const crearPedido = async (req, res) => {
  try {
    const { sushis, total, cliente } = req.body;

    // Validar que los sushis sean válidos
    for (let i = 0; i < sushis.length; i++) {
      const sushiExistente = await Sushi.findById(sushis[i].sushi);
      if (!sushiExistente) {
        return res
          .status(400)
          .json({ error: `El sushi con ID ${sushis[i].sushi} no existe.` });
      }
    }

    // Crear el pedido
    const pedido = new Pedido({
      sushis,
      total,
      cliente,
    });

    await pedido.save();

    // Incluir el ID en la respuesta junto con otros datos
    res.status(201).json({
      id: pedido._id,
      sushis: pedido.sushis,
      total: pedido.total,
      cliente: pedido.cliente,
      estado: pedido.estado, // Si tienes un campo 'estado' en tu modelo
      creadoEn: pedido.createdAt, // Si tienes timestamps habilitados
    });
  } catch (error) {
    res.status(500).json({
      error: "Hubo un error al crear el pedido",
      details: error.message,
    });
  }
};

// Obtener todos los pedidos
const obtenerPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find().populate("sushis.sushi");
    res.status(200).json(pedidos);
  } catch (error) {
    res.status(500).json({
      error: "Hubo un error al obtener los pedidos",
      details: error.message,
    });
  }
};

// Obtener un pedido por ID
const obtenerPedidoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const pedido = await Pedido.findById(id).populate("sushis.sushi");
    if (!pedido) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }
    res.status(200).json(pedido);
  } catch (error) {
    res.status(500).json({
      error: "Hubo un error al obtener el pedido",
      details: error.message,
    });
  }
};

// Actualizar el estado de un pedido
const actualizarEstadoPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    // Verificar que el estado sea válido
    const estadosValidos = [
      "pendiente",
      "en proceso",
      "completado",
      "cancelado",
    ];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ error: "Estado no válido" });
    }

    const pedido = await Pedido.findByIdAndUpdate(
      id,
      { estado },
      { new: true }
    ).populate("sushis.sushi");

    if (!pedido) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }

    res.status(200).json(pedido);
  } catch (error) {
    res.status(500).json({
      error: "Hubo un error al actualizar el estado del pedido",
      details: error.message,
    });
  }
};

// Eliminar un pedido
const eliminarPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const pedido = await Pedido.findByIdAndDelete(id);
    if (!pedido) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }
    res.status(200).json({ message: "Pedido eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({
      error: "Hubo un error al eliminar el pedido",
      details: error.message,
    });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params; // Get the ID from the URL parameters

    // Find the order by its ID and update the status to "cancelled"
    const order = await Pedido.findByIdAndUpdate(
      id, // Order ID
      { estado: "cancelado" }, // Update the status property
      { new: true } // Return the updated document
    );

    // If the order is not found, return an error
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Respond with the updated order
    return res.status(200).json(order);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error cancelling the order" });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    // Supongamos que recibes el ID del pedido como parámetro
    const pedidoId = req.params.id;

    // Busca el pedido y utiliza populate para traer información del modelo Sushi
    const pedido = await Pedido.findById(pedidoId).populate("sushis.sushi");

    if (!pedido) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }

    // Formatear los datos para la respuesta
    const detalles = {
      cliente: pedido.cliente,
      estado: pedido.estado,
      fecha: pedido.fecha.toLocaleString("es-ES", {
        timeZone: "America/Santiago",
      }), // Ajusta el formato y zona horaria
      total: `$${pedido.total}`,
      sushis: pedido.sushis.map((item) => ({
        nombre: item.sushi.nombre,
        cantidad: item.cantidad,
      })),
    };

    // Responder con los detalles
    return res.json(detalles);
  } catch (error) {
    console.error("Error al obtener el pedido:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

const obtenerHistorialPedidos = async (req, res) => {
  try {
    // Obtener el usuarioId desde los parámetros de la solicitud
    const { usuarioId } = req.params;

    // Verificar que el usuarioId es válido
    if (!usuarioId) {
      return res.status(400).json({ error: "El usuarioId es obligatorio." });
    }

    // Buscar al usuario y obtener su historial de pedidos
    const usuario = await User.findById(usuarioId).populate({
      path: "historialPedidos", // Buscar los pedidos en el historial
      populate: {
        path: "sushis.sushi", // Asegurar que se obtienen los detalles de los sushis
        model: "Sushi", // Poblamos los detalles del sushi con el modelo Sushi
      },
    });

    // Si no se encuentra al usuario, retornar error
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    // El historial de pedidos ya está poblado con los detalles de los sushis
    res.status(200).json(usuario.historialPedidos);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Hubo un error al recuperar el historial de pedidos.",
      details: error.message,
    });
  }
};

module.exports = {
  crearPedido,
  obtenerPedidos,
  obtenerPedidoPorId,
  actualizarEstadoPedido,
  eliminarPedido,
  cancelOrder,
  getOrderDetails,
  obtenerHistorialPedidos,
};
