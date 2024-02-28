const Device = require('../model/device.model.js'); 

const addDevice = async (req, res) => {
    const { adminUser, room, monitoredUsers, sensors, graphicScreenMessages } = req.body;

    try {
        // Crear el nuevo dispositivo con datos detallados para cada sensor
        const newDevice = new Device({
            adminUser,
            room,
            monitoredUsers,
            sensors: {
                gasDetector: {
                    parameters: sensors.gasDetector.parameters,
                    data: sensors.gasDetector.data,
                    alerts: sensors.gasDetector.alerts,
                },
                ultrasonic: {
                    parameters: sensors.ultrasonic.parameters,
                    data: sensors.ultrasonic.data,
                    alerts: sensors.ultrasonic.alerts,
                },
                temperature: {
                    parameters: sensors.temperature.parameters,
                    data: sensors.temperature.data,
                    alerts: sensors.temperature.alerts,
                },
            },
            graphicScreenMessages,
        });

        const savedDevice = await newDevice.save();
        res.send(savedDevice);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al agregar el dispositivo');
    }
};

const getDevices = async (req, res) => {
    try {
        const devices = await Device.find({}).populate('adminUser');
        res.send(devices);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los dispositivos');
    }
};

const updateDevice = async (req, res) => {
    try {
        const deviceId = req.params.id;
        const deviceData = req.body;

        const updatedDevice = await Device.findByIdAndUpdate(deviceId, deviceData, { new: true });
        if (!updatedDevice) {
            return res.status(404).send('Device not found');
        }

        res.json({ message: 'Device updated successfully', device: updatedDevice });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al actualizar el dispositivo');
    }
};

const deleteDevice = async (req, res) => {
    try {
        const deviceId = req.params.id;
        const deletedDevice = await Device.findByIdAndDelete(deviceId);

        if (!deletedDevice) {
            return res.status(404).send('Device not found');
        }

        res.json({ message: 'Device deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar el dispositivo');
    }
};

const getDeviceById = async (req, res) => {
    try {
        const deviceId = req.params.id;
        const device = await Device.findById(deviceId).populate('adminUser');

        if (!device) {
            return res.status(404).send('Device not found');
        }

        res.json(device);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener el dispositivo');
    }
};

//---------------------------------------------------------------------------------------------------------------------Devices

const getDevicesByAdmin = async (req, res) => {
    const { adminId } = req.user; // Asume autenticación y autorización

    try {
        const devices = await Device.find({ adminUser: adminId });
        res.status(200).json(devices);
    } catch (error) {
        res.status(500).send({ message: 'Error al obtener dispositivos', error: error.message });
    }
};

const saveSensorData = async (req, res) => {
    const { deviceId, sensorType } = req.params; // Asegúrate de que 'sensorType' sea uno de los definidos en el modelo
    const data = req.body; // La data debe incluir el valor y posiblemente el timestamp

    try {
        const update = { $push: {} };
        update.$push[`sensors.${sensorType}.data`] = data;

        const updatedDevice = await Device.findByIdAndUpdate(deviceId, update, { new: true });
        if (!updatedDevice) {
            return res.status(404).send('Device not found');
        }
        res.json({ message: 'Sensor data saved successfully', device: updatedDevice });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error saving sensor data');
    }
};



const getSensorData = async (req, res) => {
    const { deviceId, sensorType } = req.params;

    try {
        const device = await Device.findById(deviceId);
        if (!device) {
            return res.status(404).send('Device not found');
        }

        // Accede directamente a los datos del sensor específico
        const sensorData = device.sensors[sensorType].data;
        res.json(sensorData);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error getting sensor data');
    }
};


const saveGraphicScreenMessage = async (req, res) => {
    const { deviceId, message, messageType } = req.body;

    try {
        const device = await Device.findById(deviceId);
        if (!device) {
            return res.status(404).send('Device not found');
        }

        device.graphicScreenMessages.push({ message, messageType });
        await device.save();
        res.status(200).json({ message: 'Graphic screen message saved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error saving graphic screen message');
    }
};

const loadGraphicScreenMessages = async (req, res) => {
    const { deviceId } = req.params;

    try {
        const device = await Device.findById(deviceId);
        if (!device) {
            return res.status(404).send('Device not found');
        }

        res.status(200).json(device.graphicScreenMessages);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading graphic screen messages');
    }
};

const saveSensorAlert = async (req, res) => {
    const { deviceId, sensorType } = req.params; // sensorType debe ser uno de 'gasDetector', 'ultrasonic', 'temperature'
    const { timestamp, message, messageType } = req.body;

    try {
        const alertData = { timestamp, message, messageType };
        const update = {};
        update[`sensors.${sensorType}.alerts`] = alertData;

        const updatedDevice = await Device.findByIdAndUpdate(
            deviceId,
            { $push: update },
            { new: true, safe: true, upsert: true }
        );

        if (!updatedDevice) {
            return res.status(404).send('Device not found');
        }

        res.json({ message: 'Sensor alert saved successfully', device: updatedDevice });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error saving sensor alert');
    }
};

const getSensorAlerts = async (req, res) => {
    const { deviceId, sensorType } = req.params; // sensorType debe ser uno de 'gasDetector', 'ultrasonic', 'temperature'

    try {
        const device = await Device.findById(deviceId);
        if (!device) {
            return res.status(404).send('Device not found');
        }

        const sensorAlerts = device.sensors[sensorType].alerts;
        res.json(sensorAlerts);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error getting sensor alerts');
    }
};



module.exports = {
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
  };
  

