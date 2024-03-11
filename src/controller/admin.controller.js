const mongoose = require('mongoose');
const Admin = require('../model/admin.model.js'); // Asegúrate de que el nombre del archivo y la ruta sean correctos
const User = require('../model/user.model.js'); // Asegúrate de que la ruta sea correcta
const Device = require('../model/device.model.js'); 
const { authenticate } = require('../utils/auth.utils');
const bcrypt = require('bcrypt');
const saltRounds = 10; // Define saltRounds aquí

// En admin.controller.js y user.controller.js
const { login } = require('../utils/auth.utils.js');

// Usar login donde necesites realizar la operación de inicio de sesión.

const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET_KEY;

const loginAdmin = async (req, res) => {
  try {
    // Captura tanto el token como el role del objeto devuelto por authenticate
    const { token, role } = await authenticate(req.body.email, req.body.password, Admin);
    // Ahora puedes usar tanto token como role en la respuesta
    res.json({ message: 'Admin logged in successfully', token, role });
  } catch (error) {
    res.status(401).send(error.message);
  }
};


const registerAdmin = async (req, res) => {
  try {
    // Hash de la contraseña antes de guardar el admin
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const newAdmin = new Admin({
      ...req.body,
      password: hashedPassword, // Asegúrate de guardar el hash, no la contraseña en texto plano
    });

    // Guardar el administrador en la base de datos
    const savedAdmin = await newAdmin.save();

    // No devuelvas la contraseña, ni siquiera el hash
    savedAdmin.password = undefined;

    // No incluir la contraseña en la respuesta
    const adminResponse = { ...savedAdmin._doc };
    delete adminResponse.password;

    res.status(201).json({ message: 'Admin registered successfully', admin: adminResponse });
  } catch (error) {
    // Manejar errores específicos aquí (por ejemplo, usuario duplicado)
    console.error(error);
    res.status(400).send('Error registering admin');
  }
};

const getAdmins = async (req, res) => {
    try {
        // Utiliza directamente Admin para hacer la consulta
        const admins = await Admin.find({});
        res.send(admins);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los administradores');
    }
};

const updateAdmin = async (req, res) => {
  try {
      const adminId = req.params.id;
      const updateData = req.body;

      // Si se actualiza la contraseña, hashea la nueva antes de guardarla
      if (updateData.password) {
          updateData.password = await bcrypt.hash(updateData.password, saltRounds);
      }

      const updatedAdmin = await Admin.findByIdAndUpdate(adminId, updateData, { new: true });

      if (!updatedAdmin) {
          return res.status(404).send('Admin no encontrado');
      }

      // No devuelvas la contraseña, ni siquiera el hash
      updatedAdmin.password = undefined;

      res.json({ message: 'Admin actualizado correctamente', admin: updatedAdmin });
  } catch (error) {
      res.status(400).send(error.message);
  }
};

const deleteAdmin = async (req, res) => {
  try {
      const adminId = req.params.id;
      const deletedAdmin = await Admin.findByIdAndDelete(adminId);

      if (!deletedAdmin) {
          return res.status(404).send('Admin no encontrado');
      }

      res.json({ message: 'Admin eliminado correctamente' });
  } catch (error) {
      res.status(500).send(error.message);
  }
};

const getAdminById = async (req, res) => {
  try {
      const adminId = req.params.id;
      const admin = await Admin.findById(adminId);

      if (!admin) {
          return res.status(404).send('Admin no encontrado');
      }

      res.json(admin);
  } catch (error) {
      res.status(500).send(error.message);
  }
};

//--------------------------------------------------------------------------------------------------Admnis
const addUserForAdmin = async (req, res) => {
  const { userEmail } = req.body; // Utiliza el correo electrónico en lugar del ID
  const adminId = req.params.adminId;

  try {
      // Buscar al usuario por correo electrónico en lugar de ID
      const user = await User.findOne({ email: userEmail });
      if (!user) {
          return res.status(404).send('Usuario no encontrado.');
      }

      // Buscar al admin por ID y verificar si el usuario ya está asociado
      const admin = await Admin.findById(adminId);
      if (!admin) {
          return res.status(404).send('Administrador no encontrado.');
      }

      const isUserAlreadyMonitored = admin.monitoredUsers.some(userId => userId.equals(user._id));
      if (isUserAlreadyMonitored) {
          return res.status(400).send('Este usuario ya está asociado con el administrador.');
      }

      // Asociar el usuario con el administrador
      admin.monitoredUsers.push(user._id);
      await admin.save();

      res.status(200).json({ message: 'Usuario asociado exitosamente con el administrador', admin });
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al asociar el usuario con el administrador.');
  }
};

const sendMonitoringRequest = async (req, res) => {
  const { userEmail } = req.body; // Utiliza el correo electrónico en lugar del ID
  const adminId = req.user._id; // Se asume la autenticación previa

  try {
      // Buscar al usuario por correo electrónico para obtener su ID
      const user = await User.findOne({ email: userEmail });
      if (!user) {
          return res.status(404).send('Usuario no encontrado.');
      }

      // Añadir la solicitud de monitoreo al admin
      const admin = await Admin.findById(adminId);
      const alreadyRequested = admin.sentMonitoringRequests.some(request => request.userId.equals(user._id));

      if (alreadyRequested) {
          return res.status(400).send('La solicitud ya fue enviada a este usuario.');
      }

      admin.sentMonitoringRequests.push({ userId: user._id, status: 'pending' });
      await admin.save();

      res.status(200).send('Solicitud de monitoreo enviada correctamente.');
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al enviar la solicitud de monitoreo.');
  }
};

const removeUser = async (req, res) => {
  try {
      const { userEmail } = req.params;
      const adminId = req.user._id;

      const user = await User.findOne({ email: userEmail });
      if (!user) {
          return res.status(404).send('Usuario no encontrado.');
      }

      const admin = await Admin.findById(adminId);
      if (!admin) {
          return res.status(404).send('Administrador no encontrado.');
      }

      const index = admin.monitoredUsers.indexOf(user._id);
      if (index > -1) {
          admin.monitoredUsers.splice(index, 1);
          await admin.save();

          // Adicionalmente, remover la relación del usuario con cualquier dispositivo asociado a este admin
          await Device.updateMany({ adminUser: adminId }, { $pull: { monitoredUsers: user._id } });

          res.status(200).json({ message: 'Usuario removido exitosamente.' });
      } else {
          return res.status(404).send('Usuario no estaba asociado con este administrador.');
      }
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al remover el usuario.');
  }
};


// Obtener usuarios asociados a un admin
const getUsersForAdmin = async (req, res) => {
  try {
    const adminId = req.params.adminId;
    // Verifica primero si el ID proporcionado es válido para un documento MongoDB.
    if (!mongoose.Types.ObjectId.isValid(adminId)) {
      return res.status(400).send('ID de Admin inválido');
    }

    const admin = await Admin.findById(adminId).populate('monitoredUsers');

    if (!admin) {
      return res.status(404).send('Admin no encontrado');
    }

    // Podrías querer verificar también si el admin tiene usuarios monitoreados.
    if (admin.monitoredUsers.length === 0) {
      return res.status(204).send(); // 204 No Content, si prefieres indicar que la operación fue exitosa pero no hay contenido para devolver.
    }

    res.json(admin.monitoredUsers);
  } catch (error) {
    console.error(`Error al obtener usuarios para el admin ${req.params.adminId}: ${error.message}`);
    res.status(500).send('Error al procesar la solicitud');
  }
};

// Obtener todas las solicitudes de monitoreo para un admin
const getMonitoringRequestsForAdmin = async (req, res) => {
  try {
    const adminId = req.params.adminId;
    const admin = await Admin.findById(adminId).populate('sentMonitoringRequests.userId');
    if (!admin) {
      return res.status(404).send('Admin no encontrado');
    }
    res.json(admin.sentMonitoringRequests);
  } catch (error) {
    res.status(500).send(error.message);
  }
};


//-------------------------------------------------------------------------------------------------------------------Admins-Users

const addDevice = async (req, res) => {
  const { adminId } = req.user; // Asume que el ID del admin está disponible en req.user
  const deviceDetails = req.body;

  try {
      const newDevice = new Device({
          ...deviceDetails,
          adminUser: adminId,
      });
      const savedDevice = await newDevice.save();
      res.status(201).json(savedDevice);
  } catch (error) {
      res.status(500).send({ message: 'Error al agregar el dispositivo', error: error.message });
  }
};

const deleteDevice = async (req, res) => {
  const { deviceId } = req.params;

  try {
      // Primero verificar si el dispositivo existe y obtener su referencia
      const device = await Device.findById(deviceId);
      if (!device) {
          return res.status(404).send({ message: 'Dispositivo no encontrado' });
      }

      // Proceder con la eliminación del dispositivo
      await Device.findByIdAndDelete(deviceId);

      // Opcionalmente, si se manejan referencias de dispositivos dentro de los modelos de Usuario,
      // remover esta referencia del dispositivo para todos los usuarios asociados
      await User.updateMany({}, { $pull: { monitoredDevices: deviceId } });

      res.status(200).json({ message: 'Dispositivo eliminado correctamente' });
  } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Error al eliminar el dispositivo', error: error.message });
  }
};


const assignUsersToDevice = async (req, res) => {
  const { deviceId } = req.params;
  const { userIds } = req.body; // Lista de IDs de usuarios

  try {
      const device = await Device.findById(deviceId);
      if (!device) return res.status(404).send({ message: 'Dispositivo no encontrado' });

      userIds.forEach(userId => {
          if (!device.monitoredUsers.includes(userId)) {
              device.monitoredUsers.push(userId);
          }
      });

      await device.save();
      res.status(200).json({ message: 'Usuarios asignados correctamente', device });
  } catch (error) {
      res.status(500).send({ message: 'Error al asignar usuarios al dispositivo', error: error.message });
  }
};

const unassignUsersFromDevice = async (req, res) => {
  const { deviceId } = req.params;
  const { userIds } = req.body; // IDs de usuarios a desasignar

  try {
      const device = await Device.findById(deviceId);
      if (!device) return res.status(404).send({ message: 'Dispositivo no encontrado' });

      // Eliminar usuarios de la lista monitoredUsers del dispositivo
      device.monitoredUsers = device.monitoredUsers.filter(userId => !userIds.includes(userId.toString()));
      await device.save();

      // Opcional: Si User model tiene referencias a Device, elimínalas aquí
      //await User.updateMany({ _id: { $in: userIds } }, { $pull: { deviceRefs: deviceId } });

      res.status(200).json({ message: 'Usuarios desasignados correctamente', device });
  } catch (error) {
      res.status(500).send({ message: 'Error al desasignar usuarios del dispositivo', error: error.message });
  }
};



module.exports = {
  registerAdmin,
  loginAdmin,
  login,
  getAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  addUserForAdmin,
  sendMonitoringRequest,
  removeUser,
  deleteDevice,
  addDevice,
  assignUsersToDevice,
  unassignUsersFromDevice,
  getMonitoringRequestsForAdmin,
  getUsersForAdmin
};
