const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin, getAdmins, getAdminById, updateAdmin, deleteAdmin, addUserForAdmin, sendMonitoringRequest, removeUser, addDevice, deleteDevice , assignUsersToDevice, unassignUsersFromDevice} = require('../controller/admin.controller');
const { protect } = require('../middleware/authMiddleware'); // Middleware de autenticación y chequeo de rol

// Registro de administrador
router.post('/register', registerAdmin);

// Inicio de sesión de administrador
router.post('/login', loginAdmin);

// Asume que tienes autenticación y autorización middleware para proteger esta ruta
router.post('/admin/:adminId/addUser', protect, addUserForAdmin);

router.post('/sendMonitoringRequest/:userId', protect, sendMonitoringRequest);

router.post('/removeUser/:userId', protect, removeUser);

router.post('/devices', protect, addDevice);

router.post('/devices/:deviceId/assignUsers', protect, assignUsersToDevice);

router.post('/devices/:deviceId/unassignUsers', protect, unassignUsersFromDevice);

// Obtener todos los administradores
router.get('/', getAdmins);

// Obtener un administrador por ID
router.get('/:id', getAdminById);

// Actualizar un administrador
router.put('/:id', updateAdmin);

// Eliminar un administrador
router.delete('/:id', deleteAdmin);

router.delete('/devices/:deviceId', protect, deleteDevice );


module.exports = router;
