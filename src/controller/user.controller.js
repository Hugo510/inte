const User = require('../model/user.model.js');
const Admin = require('../model/admin.model.js');
const { authenticate } = require('../utils/auth.utils');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const registerUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const newUser = new User({
      ...req.body,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    savedUser.password = undefined; // No devolver la contraseña

    res.status(201).json({ message: 'User registered successfully', user: savedUser });
  } catch (error) {
    res.status(400).send(error.message);
  }
};
const loginUser = async (req, res) => {
  try {
    // Asume que authenticate ahora espera solo un modelo relevante según el tipo de login
    const { token, role } = await authenticate(req.body.email, req.body.password, User);
    res.json({ message: 'User logged in successfully', token, role });
  } catch (error) {
    res.status(401).send(error.message);
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;

    // Hashear nueva contraseña si se está actualizando
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, saltRounds);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
    if (!updatedUser) {
      return res.status(404).send('User not found');
    }

    updatedUser.password = undefined; // No devolver la contraseña
    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    res.status(400).send(error.message);
  }
};


const deleteUser = async (req, res) => {
  try {
      const userId = req.params.id;
      const deletedUser = await User.findByIdAndDelete(userId);

      if (!deletedUser) {
          return res.status(404).send('User not found');
      }

      res.json({ message: 'User deleted successfully' });
  } catch (error) {
      res.status(500).send(error.message);
  }
};

const getUserById = async (req, res) => {
  try {
      const userId = req.params.id;
      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).send('User not found');
      }

      res.json(user);
  } catch (error) {
      res.status(500).send(error.message);
  }
};


const getUsers = async (req, res) => {
  try {
      const users = await User.find({});
      res.json(users);
  } catch (error) {
      res.status(500).send(error.message);
  }
};

const acceptMonitoringRequest = async (req, res) => {
  const { adminId } = req.params;
    const userId = req.user._id; // Asume autenticación

    try {
        const user = await User.findById(userId);
        const requestIndex = user.monitoringRequests.findIndex(request => request.adminId.equals(adminId));

        if (requestIndex === -1) {
            return res.status(404).send('Solicitud no encontrada.');
        }

        user.monitoringRequests[requestIndex].status = 'accepted';
        await user.save();

        // Opcional: Actualizar el modelo Admin para reflejar la aceptación

        res.status(200).send('Solicitud aceptada.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al aceptar la solicitud.');
    }
};

const removeAdmin = async (req, res) => {
  const userId = req.user._id; // Asume autenticación y que tienes el ID del usuario
    const { adminId } = req.body; // El ID del admin a eliminar

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('Usuario no encontrado.');
        }

        // Eliminar la solicitud o la asociación con el admin
        const index = user.monitoringRequests.findIndex(request => request.adminId.equals(adminId));
        if (index !== -1) {
            user.monitoringRequests.splice(index, 1); // Eliminar la solicitud
            await user.save();
        }

        // Opcionalmente, actualizar el Admin para reflejar esta eliminación
        await Admin.findByIdAndUpdate(adminId, { $pull: { monitoredUsers: userId } });

        res.status(200).json({ message: 'Administrador eliminado de las solicitudes de monitoreo' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar la asociación con el administrador.');
    }
};


module.exports = {
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
  getUserById,
  getUsers,
  acceptMonitoringRequest,
  removeAdmin
};

