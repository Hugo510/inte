const express = require('express');
const router = express.Router();
const { addDevice, getDevices, updateDevice, deleteDevice, getDeviceById } = require('../controller/device.controller');

// Agregar un dispositivo
router.post('/', addDevice);

// Obtener todos los dispositivos
router.get('/', getDevices);

// Obtener un dispositivo por ID
router.get('/:id', getDeviceById);

// Actualizar un dispositivo
router.put('/:id', updateDevice);

// Eliminar un dispositivo
router.delete('/:id', deleteDevice);

module.exports = router;
