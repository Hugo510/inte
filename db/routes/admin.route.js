const express = require('express');
//const { registerAdmin, getAdmins } = require('../controller/admin.controller.js');
const adminController = require('../controller/admin.controller');
const router = express.Router();

//router.post('/registerAdmin', registerAdmin);
//router.get('/getAdmins', getAdmins);

// Ruta para iniciar sesión como administrador
router.post('/login/admin', adminController.loginAdmin);

// Ruta protegida para admin
router.get('/admin/some-protected-route', accessRole(['admin']), (req, res) => {
    // Lógica específica de admin
  });


module.exports = router;
