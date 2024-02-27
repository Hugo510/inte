const Device = require('../model/device.model.js'); 

const addDevice = async (req, res) => {
    const { adminUser, ...deviceData } = req.body;

    try {
        const newDevice = new Device({
            adminUser,
            ...deviceData
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

const saveDataSensors = async (req, res) => {
    const { deviceId, sensorType } = req.params;
    const { timestamp, value } = req.body;

    try {
        const sensorData = { timestamp, value };
        const update = {};
        update[`sensors.${sensorType}.data`] = sensorData;

        const updatedDevice = await Device.findByIdAndUpdate(
            deviceId,
            { $push: update },
            { new: true, safe: true, upsert: true }
        );

        res.json(updatedDevice);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

const getSensorData = async (req, res) => {
    const { deviceId, sensorType } = req.params;

    try {
        const device = await Device.findById(deviceId);
        if (!device) {
            return res.status(404).send('Dispositivo no encontrado');
        }

        const sensorData = device.sensors[sensorType].data;
        res.json(sensorData);
    } catch (error) {
        res.status(400).send(error.message);
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
    loadGraphicScreenMessages
  };
  

