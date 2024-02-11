const Admin = require('../model/admin.model.js'); // Asegúrate de que el nombre del archivo y la ruta sean correctos
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



module.exports = {
  registerAdmin,
  loginAdmin,
  getAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin
};
