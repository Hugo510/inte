const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin, getAdmins, getAdminById, updateAdmin, deleteAdmin, addUserForAdmin, sendMonitoringRequest, removeUser } = require('../controller/admin.controller');

// Registro de administrador
router.post('/register', registerAdmin);

// Inicio de sesión de administrador
router.post('/login', loginAdmin);

// Asume que tienes autenticación y autorización middleware para proteger esta ruta
router.post('/admin/:adminId/addUser', addUserForAdmin);

router.post('/sendMonitoringRequest/:userId', sendMonitoringRequest);

router.post('/removeUser/:userId',removeUser);

// Obtener todos los administradores
router.get('/', getAdmins);

// Obtener un administrador por ID
router.get('/:id', getAdminById);

// Actualizar un administrador
router.put('/:id', updateAdmin);

// Eliminar un administrador
router.delete('/:id', deleteAdmin);

module.exports = router;
