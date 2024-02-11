const Admin = require('../model/admin.model.js'); // Asegúrate de que el nombre del archivo y la ruta sean correctos
const User = require('../model/user.model.js'); // Asegúrate de que la ruta sea correcta
const { authenticate } = require('../utils/auth.utils');
const bcrypt = require('bcrypt');
const saltRounds = 10; // Define saltRounds aquí
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

const addUserForAdmin = async (req, res) => {
  try {
    const { userId } = req.body; // Asume que recibes el ID del usuario existente como parte del cuerpo de la solicitud
    const adminId = req.params.adminId; // Asume que recibes el ID del admin como parte de la URL

    // Verificar si el usuario existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('Usuario no encontrado.');
    }

    // Opcional: Verificar si el administrador existe
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).send('Administrador no encontrado.');
    }

    // Verificar si el usuario ya está asociado con este administrador
    const isUserAlreadyMonitored = admin.monitoredUsers.some((monitoredUserId) => monitoredUserId.equals(user._id));
    if (isUserAlreadyMonitored) {
      return res.status(400).send('Este usuario ya está asociado con el administrador.');
    }

    // Asociar el usuario existente con el administrador
    admin.monitoredUsers.push(user._id);
    await admin.save();

    res.status(200).json({ message: 'Usuario asociado exitosamente con el administrador', admin });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al asociar el usuario con el administrador.');
  }
};

const sendMonitoringRequest = async (req, res) => {
  const { userId } = req.params;
    const adminId = req.user._id; // Asume que la autenticación está manejada y el ID del admin está disponible

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('Usuario no encontrado.');
        }

        // Verificar duplicados
        const isAlreadyRequested = user.monitoringRequests.some(request => request.adminId.equals(adminId));
        if (isAlreadyRequested) {
            return res.status(400).send('La solicitud ya fue enviada.');
        }

        user.monitoringRequests.push({ adminId, status: 'pending' });
        await user.save();

        res.status(200).send('Solicitud de monitoreo enviada.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al enviar la solicitud de monitoreo.');
    }
};

const removeUser = async (req, res) => {
  const { userId } = req.params;
    const adminId = req.user._id; // Asume autenticación y que tienes el ID del admin

    try {
        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).send('Administrador no encontrado.');
        }

        // Eliminar al usuario de la lista de monitoredUsers
        admin.monitoredUsers.pull(userId); // Mongoose proporciona el método pull para eliminar por ObjectId
        await admin.save();

        // Opcionalmente, eliminar la referencia del admin en el User
        const user = await User.findById(userId);
        if (user && user.adminUser.equals(adminId)) {
            user.adminUser = null; // o undefined, dependiendo de cómo quieras manejarlo
            await user.save();
        }

        res.status(200).json({ message: 'Usuario eliminado de monitoredUsers' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar el usuario.');
    }
};


module.exports = {
  registerAdmin,
  loginAdmin,
  getAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  addUserForAdmin,
  sendMonitoringRequest,
  removeUser
};
