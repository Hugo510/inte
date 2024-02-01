const express = require('express');
const app = express();

// Middleware para verificar el rol del usuario
const checkRole = (roles) => (req, res, next) => {
  // Suponiendo que el usuario se ha autenticado y su rol está disponible en req.user.role
  if (roles.includes(req.user.role)) {
    next();
  } else {
    res.status(403).send('Acceso denegado');
  }
};

const accessRole = (roles) => {
  return (req, res, next) => {
    // Suponiendo que el rol del usuario está en req.user.role
    if (req.user && roles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).send('Acceso denegado: no tienes permisos para realizar esta acción');
    }
  };
};

// Ejemplo de uso del middleware en una ruta
app.get('/admin/dashboard', checkRole(['admin']), (req, res) => {
  // Lógica para mostrar el dashboard de admin
  res.send('Dashboard de Admin');
});

app.get('/user/dashboard', checkRole(['monitor']), (req, res) => {
  // Lógica para mostrar el dashboard de usuario
  res.send('Dashboard de Usuario');
});

module.exports = accessRole;