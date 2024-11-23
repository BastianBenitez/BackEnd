// controllers/userController.js
const User = require("../models/Usuario"); // Asegúrate de importar el modelo

const getUsers = async (req, res) => {
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

const getUserById = async (req, res) => {
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

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { nombre, email, password } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { nombre, email, password, updatedAt: Date.now() },
      { new: true }
    );
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar el usuario" });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el usuario" });
  }
};

// Controller to toggle admin privileges (switch between true/false)
const switchRoleAdmin = async (req, res) => {
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

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  switchRoleAdmin,
};
