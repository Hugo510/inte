const express = require('express');
//const { login, register } = require('../controller/user.controller.js');
const userController = require('../controller/user.controller');
const router = express.Router();

// Ruta para iniciar sesión como usuario
router.post('/login/user', userController.loginUser);

// Ruta protegida para usuarios de monitor
router.get('/monitor/some-protected-route', accessRole(['monitor']), (req, res) => {
    // Lógica específica de monitor
  });

//router.post('/register', register);
//router.post('/login', login);

module.exports = router;
