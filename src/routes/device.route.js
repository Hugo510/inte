const express = require('express');
const router = express.Router();
const {
    addDevice,
    getDevices,
    updateDevice,
    deleteDevice,
    getDeviceById,
    getDevicesByAdmin,
    getSensorData,
    saveDataSensors,
    saveGraphicScreenMessage, // Asegúrate de que estos controladores estén importados
    loadGraphicScreenMessages
} = require('../controller/device.controller');

const { protect } = require('../middleware/authMiddleware'); // Middleware de autenticación y chequeo de rol

// Agregar un dispositivo
router.post('/', addDevice);

// Guardar datos de sensores
router.post('/devices/:deviceId/sensors/:sensorType/data', saveDataSensors);

// Obtener todos los dispositivos
router.get('/', getDevices);

// Obtener un dispositivo por ID
router.get('/:id', getDeviceById);

// Obtener dispositivos por administrador
router.get('/byAdmin', protect, getDevicesByAdmin);

// Obtener datos de sensores
router.get('/devices/:deviceId/sensors/:sensorType/data', getSensorData),

// Actualizar un dispositivo
router.put('/:id', updateDevice);

// Eliminar un dispositivo
router.delete('/:id', deleteDevice);

// Rutas para manejar mensajes de la pantalla gráfica
// Guardar un mensaje de pantalla gráfica
router.post('/devices/:deviceId/graphicScreenMessage', saveGraphicScreenMessage);

// Cargar mensajes de pantalla gráfica
router.get('/devices/:deviceId/graphicScreenMessages', loadGraphicScreenMessages);

module.exports = router;
