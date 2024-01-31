const Admin = require('../models/admin.model.js'); // Asegúrate de que la ruta sea correcta

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

module.exports = { registerAdmin, getAdmins };
