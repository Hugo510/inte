const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateUser, deleteUser, getUserById, getUsers, acceptMonitoringRequest, removeAdmin } = require('../controller/user.controller');

// Registro de usuario
router.post('/register', registerUser);

// Inicio de sesión de usuario
router.post('/login', loginUser);

router.post('/acceptMonitoringRequest/:adminId',acceptMonitoringRequest);

router.post('/removeAdmin',removeAdmin)

// Obtener todos los usuarios
router.get('/', getUsers);

// Obtener un usuario por ID
router.get('/:id', getUserById);

// Actualizar un usuario
router.put('/:id', updateUser);

// Eliminar un usuario
router.delete('/:id', deleteUser);

module.exports = router;
