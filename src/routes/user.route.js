const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  login,
  updateUser,
  deleteUser,
  getUserById,
  getUsers,
  acceptMonitoringRequest,
  removeAdmin,
  rejectMonitoringRequest,
  getDevicesForUser,
  getAdminsForUser,
  getMonitoringRequestsByUserId,
  dissociateFromDevice,
  dissociateFromAdmin,
} = require('../controller/user.controller');
const { protectUser } = require('../middleware/authMiddleware'); // Middleware de autenticación para usuarios

// Registro de usuario
router.post('/register', registerUser);

// Inicio de sesión de usuario
router.post('/login', loginUser); // Corrección para usar la función correcta

// Aceptar una solicitud de monitoreo
router.post('/acceptMonitoringRequest/:adminId/:requestId', protectUser, acceptMonitoringRequest);

// Rechazar una solicitud de monitoreo
router.post('/rejectMonitoringRequest/:adminId/:requestId', protectUser, rejectMonitoringRequest);

// Eliminar un administrador
router.delete('/removeAdmin/:adminId', protectUser, removeAdmin); // Cambiado a DELETE y añadido adminId como parámetro de ruta

// Ruta para obtener las solicitudes de monitoreo de un usuario por su ID
router.get('/:userId/monitoring-requests', protectUser, getMonitoringRequestsByUserId);

// Obtener todos los usuarios
router.get('/', protectUser, getUsers); // Asegurando protección para esta ruta también

// Obtener un usuario por ID
router.get('/:id', protectUser, getUserById);

// Obtener dispositivos asociados al usuario
router.get('/devices', protectUser, getDevicesForUser);

// Obtener administradores asociados al usuario
router.get('/admins', protectUser, getAdminsForUser);

// Actualizar un usuario
router.put('/:id', protectUser, updateUser);

// Eliminar un usuario
router.delete('/:id', protectUser, deleteUser);

// Desasociarse de un dispositivo
router.delete('/dissociateDevice/:deviceId', protectUser, dissociateFromDevice); // Cambiado a DELETE y añadido deviceId como parámetro de ruta

// Desasociarse de un administrador
router.delete('/dissociateAdmin/:adminId', protectUser, dissociateFromAdmin); // Cambiado a DELETE y añadido adminId como parámetro de ruta

module.exports = router;
