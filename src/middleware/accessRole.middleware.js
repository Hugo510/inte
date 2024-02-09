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

module.exports = verifyTokenAndRole;
