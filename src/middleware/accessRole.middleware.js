const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET_KEY;

// Middleware para verificar el token y extraer el rol del usuario
const verifyTokenAndRole = (roles) => {
  return (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extracción del token
    if (!token) {
      return res.status(403).send('Acceso denegado: se requiere token para autenticación');
    }
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      req.user = decoded; // Información del usuario decodificada
      if (roles.includes(req.user.role)) {
        next();
      } else {
        res.status(403).send('Acceso denegado: no tienes permisos para realizar esta acción');
      }
    } catch (error) {
      res.status(401).send('Token inválido o expirado');
    }
  };
};

const authenticateUser = async (email, password, UserModel) => {
    // Buscar el usuario por email
    const user = await UserModel.findOne({ email });
    if (!user) {
        throw new Error('Usuario no encontrado');
    }

    // Comparar la contraseña proporcionada con la hasheada en la base de datos
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Contraseña incorrecta');
    }

    // Usuario autenticado, generar un token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return token;
};

module.exports = { authenticateUser, verifyTokenAndRole };
