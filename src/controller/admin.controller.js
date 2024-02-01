const Admin = require('../model/admin.model.js'); 
const { authenticateUser } = require('../utils/auth.utils');

const loginAdmin = async (req, res) => {
    try {
      // Llamar a la función de autenticación común con el modelo de administrador correspondiente
      const token = await authenticateUser(req.body.email, req.body.password, AdminModel);
      res.json({ message: 'Admin logged in successfully', token });
    } catch (error) {
      res.status(401).send(error.message);
    }
  };

// Función para registrar un nuevo administrador
const registerAdmin = async (req, res) => {
    try {
      // Crear una instancia del modelo Admin con los datos de la solicitud
      const newAdmin = new AdminModel(req.body);
  
      // Guardar el administrador en la base de datos
      const savedAdmin = await newAdmin.save();
  
      res.status(201).json({ message: 'Admin registered successfully', admin: savedAdmin });
    } catch (error) {
      // Manejar errores, como email duplicado
      res.status(400).send(error.message);
    }
  };

const getAdmins = async (req, res) => {
    try {
        const admins = await Admin.find({});
        res.send(admins);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los administradores');
    }
};

module.exports = { registerAdmin, getAdmins, loginAdmin };
