// controllers/userController.js
const User = require("../models/Usuario"); // Asegúrate de importar el modelo

const obtenerUsuarios = async (req, res) => {
  try {
    const users = await User.find(); // Obtener todos los usuarios de la base de datos

    // Eliminar los campos sensibles o innecesarios
    const usersWithoutSensitiveData = users.map((user) => {
      const {
        contrasena,
        createdAt,
        updatedAt,
        historialPedidos,
        fechaRegistro,
        ...userWithoutSensitiveData
      } = user.toObject(); // Elimina los campos no deseados
      return userWithoutSensitiveData;
    });

    res.json(usersWithoutSensitiveData);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

const obterUsuarioPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el usuario" });
  }
};

const actualizarUsuarios = async (req, res) => {
  try {
    const { id } = req.params; // Obtener el ID del usuario desde los parámetros de la URL
    const { nombre, apellido, email, telefono, direccion, contrasena } =
      req.body; // Obtener los datos enviados desde el frontend

    // Validar si el usuario existe
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Actualizar los campos proporcionados
    if (nombre) user.nombre = nombre;
    if (apellido) user.apellido = apellido;
    if (email) user.email = email;
    if (telefono) user.telefono = telefono;
    if (direccion) user.direccion = direccion;

    // Si se envía una nueva contraseña, actualizarla (asegúrate de encriptarla si es necesario)
    if (contrasena) {
      const bcrypt = require("bcryptjs");
      const salt = await bcrypt.genSalt(10);
      user.contrasena = await bcrypt.hash(contrasena, salt);
    }

    // Guardar los cambios en la base de datos
    const updatedUser = await user.save();

    // Responder con el usuario actualizado
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

const eliminarUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res.status(204).json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el usuario" });
  }
};

// Controller to toggle admin privileges (switch between true/false)
const cambiarRolAdmin = async (req, res) => {
  try {
    const userId = req.params.id;
    const { isAdmin } = req.body; // Recibir el valor de isAdmin desde el cuerpo de la solicitud

    // Validar que el valor de isAdmin es un booleano
    if (typeof isAdmin !== "boolean") {
      return res
        .status(400)
        .json({ message: "isAdmin debe ser un valor booleano" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Actualizar el valor de isAdmin con el valor recibido
    user.isAdmin = isAdmin;

    // Guardar el usuario actualizado
    await user.save();

    const message = isAdmin
      ? "Admin privileges granted"
      : "Admin privileges revoked";
    res.status(200).json({ message, user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error switching admin privileges", error });
  }
};

const agregarPedidoAHistorial = async (req, res) => {
  try {
    const { usuarioId, pedidoId } = req.body;

    // Verificar que ambos IDs están presentes
    if (!usuarioId || !pedidoId) {
      return res.status(400).json({
        error: "Faltan datos necesarios (usuarioId o pedidoId).",
      });
    }

    // Buscar el usuario y agregar el pedido al historial
    const usuario = await User.findById(usuarioId);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    usuario.historialPedidos.push(pedidoId);
    await usuario.save();

    res.status(200).json({
      message: "Pedido agregado al historial con éxito.",
      historialPedidos: usuario.historialPedidos,
    });
  } catch (error) {
    res.status(500).json({
      error: "Hubo un error al agregar el pedido al historial.",
      details: error.message,
    });
  }
};

module.exports = {
  obtenerUsuarios,
  obterUsuarioPorId,
  actualizarUsuarios,
  eliminarUsuario,
  cambiarRolAdmin,
  agregarPedidoAHistorial,
};
