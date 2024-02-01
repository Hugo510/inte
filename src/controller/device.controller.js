const Device = require('../model/device.model.js'); // Asegúrate de que la ruta sea correcta

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

module.exports = { addDevice, getDevices };
