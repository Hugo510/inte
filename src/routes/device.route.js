const express = require('express');
const router = express.Router();
const {
    addDevice,
    getDevices,
    updateDevice,
    deleteDevice,
    getDeviceById,
    getDevicesByAdmin,
    saveDataSensors,
    getSensorData,
    saveGraphicScreenMessage,
    loadGraphicScreenMessages,
    saveSensorAlert,
    getSensorAlerts
} = require('../controller/device.controller');

const { protect } = require('../middleware/authMiddleware'); // Middleware de autenticación

// Agregar un nuevo dispositivo
router.post('/', addDevice); // Crea un nuevo dispositivo

// Obtener todos los dispositivos
router.get('/', getDevices); // Lista todos los dispositivos

// Obtener un dispositivo específico por ID
router.get('/:id', getDeviceById); // Muestra los detalles de un dispositivo

// Actualizar un dispositivo específico por ID
router.put('/:id', updateDevice); // Actualiza los datos de un dispositivo

// Eliminar un dispositivo específico por ID
router.delete('/:id', deleteDevice); // Elimina un dispositivo

// Obtener dispositivos por administrador
router.get('/byAdmin', protect, getDevicesByAdmin); // Lista dispositivos asociados a un admin

// Guardar datos de sensor para un dispositivo específico
router.post('/:deviceId/sensors/:sensorType/data', saveDataSensors); // Añade datos de sensores

// Obtener datos de sensor para un dispositivo específico
router.get('/:deviceId/sensors/:sensorType/data', getSensorData); // Muestra datos de sensores

// Guardar un mensaje de pantalla gráfica para un dispositivo específico
router.post('/:deviceId/graphicScreenMessage', saveGraphicScreenMessage); // Añade un mensaje de pantalla gráfica

// Cargar mensajes de pantalla gráfica para un dispositivo específico
router.get('/:deviceId/graphicScreenMessages', loadGraphicScreenMessages); // Lista mensajes de pantalla gráfica

// Rutas para manejar alertas de sensores
// Guardar una alerta de sensor para un dispositivo específico
router.post('/:deviceId/sensors/:sensorType/alerts', saveSensorAlert); // Añade una alerta de sensor

// Obtener las alertas de un tipo de sensor específico de un dispositivo
router.get('/:deviceId/sensors/:sensorType/alerts', getSensorAlerts); // Muestra alertas de un tipo de sensor

module.exports = router;
