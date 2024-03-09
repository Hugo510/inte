const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin, login, getAdmins, getAdminById, updateAdmin, deleteAdmin, addUserForAdmin, sendMonitoringRequest, removeUser, addDevice, deleteDevice , assignUsersToDevice, unassignUsersFromDevice, getMonitoringRequestsForAdmin, getUsersForAdmin} = require('../controller/admin.controller');
const { protect } = require('../middleware/authMiddleware'); // Middleware de autenticación y chequeo de rol

// Registro de administrador
router.post('/register', registerAdmin);

// Inicio de sesión de administrador
router.post('/login', login);

// Asume que tienes autenticación y autorización middleware para proteger esta ruta
router.post('/admin/:adminId/addUser', protect, addUserForAdmin);

router.post('/sendMonitoringRequest/:userEmail', protect, sendMonitoringRequest);

router.post('/devices', protect, addDevice);

router.post('/devices/:deviceId/assignUsers', protect, assignUsersToDevice);

router.post('/devices/:deviceId/unassignUsers', protect, unassignUsersFromDevice);

// Obtener todos los administradores
router.get('/', getAdmins);

// Obtener un administrador por ID
router.get('/:id', getAdminById);

// Obtener usuarios (monitores) asociados a un admin
router.get('/:adminId/users', protect, getUsersForAdmin);

// Obtener solicitudes de monitoreo para un admin
router.get('/:adminId/monitoring-requests', protect, getMonitoringRequestsForAdmin);

// Actualizar un administrador
router.put('/:id', updateAdmin);

router.delete('/removeUser/:userId', protect, removeUser);

// Eliminar un administrador
router.delete('/:id', deleteAdmin);

router.delete('/devices/:deviceId', protect, deleteDevice );


module.exports = router;
