const express = require('express');
//const { registerAdmin, getAdmins } = require('../controller/admin.controller.js');
const adminController = require('../controller/admin.controller');
const router = express.Router();

// Ruta para registrar un nuevo administrador
router.post('/register', adminController.registerAdmin);
//router.get('/getAdmins', getAdmins);

// Ruta para iniciar sesión como administrador
router.post('/login/admin', adminController.loginAdmin);

// Ruta protegida para admin



module.exports = router;
