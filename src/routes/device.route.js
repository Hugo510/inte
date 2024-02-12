const express = require('express');
const router = express.Router();
const {
    addDevice,
    getDevices,
    updateDevice,
    deleteDevice,
    getDeviceById,
    getDevicesByAdmin
  } = require('../controller/device.controller');
  
const { protect } = require('../middleware/authMiddleware'); // Middleware de autenticación y chequeo de rol

// Agregar un dispositivo
router.post('/', addDevice);

// Obtener todos los dispositivos
router.get('/', getDevices);

// Obtener un dispositivo por ID
router.get('/:id', getDeviceById);

router.get('/byAdmin', protect, getDevicesByAdmin);

// Actualizar un dispositivo
router.put('/:id', updateDevice);

// Eliminar un dispositivo
router.delete('/:id', deleteDevice);

module.exports = router;
