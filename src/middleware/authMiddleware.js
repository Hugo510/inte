const jwt = require('jsonwebtoken');
const Admin = require('../model/admin.model.js'); // Asegúrate de que la ruta al modelo sea correcta
const SECRET_KEY = process.env.JWT_SECRET;

exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, SECRET_KEY);

            // Cambio clave aquí: accedemos a 'userId' en lugar de 'id'
            if (!decoded.isAdmin) {
                return res.status(403).send('Acceso restringido a administradores.');
            }

            // Buscamos al administrador usando 'userId' directamente del decoded token
            const admin = await Admin.findById(decoded.userId).select('-password'); // Ajustado a 'decoded.userId'
            if (!admin) {
                return res.status(401).send('No autorizado, usuario no encontrado');
            }

            req.admin = admin;
            next();
        } catch (error) {
            console.error(error);
            res.status(401).send('No autorizado, token fallido o inválido');
        }
    } else {
        res.status(401).send('No autorizado, token no encontrado');
    }
};


const User = require('../model/user.model.js');

exports.protectUser = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, SECRET_KEY);

            // En lugar de verificar si es admin, buscamos directamente al usuario
            const user = await User.findById(decoded.userId).select('-password'); // Usa 'userId' o 'id' según tu implementación
            if (!user) {
                return res.status(401).send('No autorizado, usuario no encontrado');
            }

            req.user = user; // Adjunta la información del usuario al request
            next();
        } catch (error) {
            console.error(error);
            res.status(401).send('No autorizado, token fallido o inválido');
        }
    } else {
        res.status(401).send('No autorizado, token no encontrado');
    }
};

