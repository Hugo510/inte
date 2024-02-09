const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin, getAdmins, getAdminById, updateAdmin, deleteAdmin } = require('../controllers/admin.controller');

// Registro de administrador
router.post('/register', registerAdmin);

// Inicio de sesión de administrador
router.post('/login', loginAdmin);

// Obtener todos los administradores
router.get('/', getAdmins);

// Obtener un administrador por ID
router.get('/:id', getAdminById);

// Actualizar un administrador
router.put('/:id', updateAdmin);

// Eliminar un administrador
router.delete('/:id', deleteAdmin);

module.exports = router;
