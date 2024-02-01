const Admin = require('../models/admin.model.js'); 
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

const registerAdmin = async (req, res) => {
    const { email, password, ...otrosDatos } = req.body;
    
    try {
        const newAdmin = new Admin({
            email,
            password, // Recuerda hashear la contraseña en una aplicación real
            ...otrosDatos
        });

        const savedAdmin = await newAdmin.save();
        res.send(savedAdmin);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al registrar el administrador');
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
