const User = require('../model/user.model.js');
const Admin = require('../model/admin.model.js');
const { authenticate } = require('../utils/auth.utils');
const Device = require('../model/device.model.js'); 
const bcrypt = require('bcrypt');
const saltRounds = 10;

// En admin.controller.js y user.controller.js
const { login } = require('../utils/auth.utils.js');

// Usar login donde necesites realizar la operación de inicio de sesión.


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
  const { adminId, requestId } = req.body; // Suponemos que requestId también se pasa para identificar la solicitud específica

  try {
      const admin = await Admin.findById(adminId);
      if (!admin) {
          return res.status(404).send('Administrador no encontrado.');
      }

      const request = admin.sentMonitoringRequests.id(requestId);
      if (!request) {
          return res.status(404).send('Solicitud no encontrada.');
      }

      if (request.status !== 'pending') {
          return res.status(400).send('La solicitud no está pendiente.');
      }

      request.status = 'accepted';
      await admin.save();

      // Opcional: actualizar el modelo de User
      const user = await User.findById(request.userId);
      if (user) {
          // Suponiendo que hay un campo para reflejar esta relación, por ejemplo 'isMonitored'
          user.isMonitored = true;
          await user.save();
      }

      res.status(200).send('Solicitud aceptada correctamente.');
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al aceptar la solicitud de monitoreo.');
  }
};


const rejectMonitoringRequest = async (req, res) => {
  const { adminId, requestId } = req.body; // Suponemos que requestId también se pasa para identificar la solicitud específica

  try {
      const admin = await Admin.findById(adminId);
      if (!admin) {
          return res.status(404).send('Administrador no encontrado.');
      }

      const request = admin.sentMonitoringRequests.id(requestId);
      if (!request) {
          return res.status(404).send('Solicitud no encontrada.');
      }

      if (request.status !== 'pending') {
          return res.status(400).send('La solicitud no está pendiente.');
      }

      request.status = 'rejected';
      await admin.save();

      res.status(200).send('Solicitud de monitoreo rechazada correctamente.');
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al rechazar la solicitud de monitoreo.');
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

      const request = user.monitoringRequests.find(request => request.adminId.equals(adminId));
      if (!request) {
          return res.status(404).send('No hay solicitudes de este administrador.');
      }

      user.monitoringRequests.pull(request._id); // Eliminar la solicitud
      await user.save();

      res.status(200).json({ message: 'Administrador eliminado de las solicitudes de monitoreo' });
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al eliminar la asociación con el administrador.');
  }
};


const getMonitoringRequestsByUserId = async (req, res) => {
  const { userId } = req.params;  // Obtener el ID del usuario desde los parámetros de la ruta

  try {
      const user = await User.findById(userId).populate({
          path: 'monitoringRequests.adminId',  // Popular los detalles del administrador que envió la solicitud
          select: 'name email'  // Seleccionar solo nombre y email del admin para mostrar
      }).populate({
          path: 'monitoringRequests.deviceId',  // También popular los detalles del dispositivo
          select: 'deviceName location'  // Seleccionar nombre y ubicación del dispositivo
      });

      if (!user) {
          return res.status(404).send('Usuario no encontrado.');
      }

      // Retornar las solicitudes de monitoreo del usuario
      res.status(200).json({ monitoringRequests: user.monitoringRequests });
  } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Error al obtener las solicitudes de monitoreo para el usuario', error: error.message });
  }
};


const getDevicesForUser = async (req, res) => {
  const { userId } = req.user; // Asume autenticación y que tienes el ID del usuario

  try {
      const devices = await Device.find({ monitoredUsers: userId }).populate('adminUser', 'email');
      res.status(200).json(devices);
  } catch (error) {
      res.status(500).send({ message: 'Error al obtener dispositivos para el usuario', error: error.message });
  }
};

const getAdminsForUser = async (req, res) => {
  const { userId } = req.user; // Asume autenticación y que tienes el ID del usuario

  try {
      const user = await User.findById(userId).populate({
          path: 'monitoringRequests.adminId',
          select: 'firstName lastName email' // Seleccionar los detalles relevantes del admin
      });

      if (!user) {
          return res.status(404).send('Usuario no encontrado.');
      }

      const admins = user.monitoringRequests.map(request => request.adminId);
      res.status(200).json({ admins });
  } catch (error) {
      res.status(500).send({ message: 'Error al obtener administradores para el usuario', error: error.message });
  }
};

const dissociateFromAdmin = async (req, res) => {
  const userId = req.user._id; // Asume autenticación y que tienes el ID del usuario
  const { adminId } = req.params; // El ID del admin se obtiene de los parámetros de la ruta

  try {
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).send('Usuario no encontrado.');
      }

      // Filtrar y remover todas las solicitudes de monitoreo asociadas con el administrador especificado
      user.monitoringRequests = user.monitoringRequests.filter(request => !request.adminId.equals(adminId));
      await user.save();

      res.status(200).json({ message: 'Administrador desasociado correctamente.' });
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al desasociar al administrador.');
  }
};

const dissociateFromDevice = async (req, res) => {
  const userId = req.user._id; // Asume autenticación y que tienes el ID del usuario
  const { deviceId } = req.params; // El ID del dispositivo se obtiene de los parámetros de la ruta

  try {
      // Eliminar la referencia del usuario del dispositivo especificado
      const updatedDevice = await Device.findByIdAndUpdate(deviceId, { $pull: { monitoredUsers: userId } }, { new: true });

      if (!updatedDevice) {
          return res.status(404).send('Dispositivo no encontrado.');
      }

      res.status(200).json({ message: 'Desasociado del dispositivo correctamente.' });
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al desasociar del dispositivo.');
  }
};


module.exports = {
  registerUser,
  loginUser,
  login,
  updateUser,
  deleteUser,
  getUserById,
  getUsers,
  rejectMonitoringRequest,
  acceptMonitoringRequest,
  removeAdmin,
  getDevicesForUser,
  getAdminsForUser,
  getMonitoringRequestsByUserId,
  dissociateFromAdmin,
  dissociateFromDevice
};

