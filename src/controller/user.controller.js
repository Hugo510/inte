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
    // Asumiendo que el hasheo de la contraseña se ha eliminado por solicitud anterior
    const newUser = new User({
      ...req.body,
      password: req.body.password,
    });

    const savedUser = await newUser.save();
    savedUser.password = undefined; // No devolver la contraseña

    res.status(201).json({ message: 'User registered successfully', user: savedUser });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    } else if (error.code && error.code === 11000) {
      return res.status(409).json({ message: 'Duplicate username or email' });
    } else {
      console.error('Unexpected error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
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
  const { userId } = req.params;
  try {
      const user = await User.findById(userId).populate({
          path: 'monitoringRequests.adminId',
          select: 'name email'
      }).populate({
          path: 'monitoringRequests.deviceId',
          /* select: 'deviceName location' */
      });

      if (!user) {
          return res.status(404).json({ message: 'Usuario no encontrado.' });
      }

      if (user.monitoringRequests.length === 0) {
          return res.status(404).json({ message: 'No se encontraron solicitudes de monitoreo para el usuario.' });
      }

      // Desactivar caché para la respuesta
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.status(200).json({ monitoringRequests: user.monitoringRequests });
  } catch (error) {
      console.error('Error retrieving monitoring requests:', error);
      res.status(500).json({ message: 'Error al obtener las solicitudes de monitoreo para el usuario', error: error.message });
  }
};

const getDevicesForUser = async (req, res) => {
  const { userId } = req.params;
  
  try {
    const user = await User.findById(userId).populate({
      path: 'devices',
      populate: { path: 'adminUser' }
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    if (!user.devices || user.devices.length === 0) {
      return res.status(200).json([]);
    }

    // Desactivar caché para la respuesta
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.status(200).json(user.devices);
  } catch (error) {
    console.error('Error retrieving devices for user:', error);
    res.status(500).json({ message: 'Error al obtener dispositivos para el usuario', error: error.message });
  }
};

const getAdminsForUser = async (req, res) => {
  const { userId } = req.params;
  try {
      const user = await User.findById(userId).populate('monitoringRequests.adminId');

      if (!user) {
          return res.status(404).json({ message: 'Usuario no encontrado.' });
      }

      const admins = user.monitoringRequests.map(request => request.adminId).filter(admin => admin != null);
      if (admins.length === 0) {
          return res.status(404).json({ message: 'No se encontraron administradores para este usuario.' });
      }

      // Desactivar caché para la respuesta
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.status(200).json({ admins });
  } catch (error) {
      console.error('Error retrieving admins for user:', error);
      res.status(500).json({ message: 'Error al obtener administradores para el usuario', error: error.message });
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

