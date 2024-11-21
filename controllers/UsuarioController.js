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

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
