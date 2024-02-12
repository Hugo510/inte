const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
  getUserById,
  getUsers,
  acceptMonitoringRequest,
  removeAdmin,
  rejectMonitoringRequest,
  getDevicesForUser
} = require('../controller/user.controller');
const { protectUser } = require('../middleware/authMiddleware'); // Middleware de autenticación para usuarios

// Registro de usuario
router.post('/register', registerUser);

// Inicio de sesión de usuario
router.post('/login', loginUser);

// Las siguientes rutas requieren que el usuario esté autenticado
router.post('/acceptMonitoringRequest/:adminId', protectUser, acceptMonitoringRequest);

// Asumiendo que necesitas especificar qué admin remover
router.post('/removeAdmin', protectUser, removeAdmin); 

router.post('/rejectMonitoringRequest/:adminId', protectUser, rejectMonitoringRequest);

// Obtener todos los usuarios
router.get('/', protectUser, getUsers); // Depende de si quieres que solo usuarios autenticados puedan ver todos los usuarios

// Obtener un usuario por ID
router.get('/:id', protectUser, getUserById);

// Obtener dispositivos para el usuario
router.get('/devices', protectUser, getDevicesForUser);

// Actualizar un usuario
router.put('/:id', protectUser, updateUser);

// Eliminar un usuario
router.delete('/:id', protectUser, deleteUser);

module.exports = router;
