const mongoose = require('mongoose');

// Definir esquemas para los datos y alertas de cada tipo de sensor
const alertSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    message: String,
    messageType: {
        type: String,
        enum: ['Alerta', 'Advertencia', 'Error'],
    },
});

const gasDetectorSchema = new mongoose.Schema({
    parameters: {
    sensitivity: { type: Number, required: true } // Para el gasDetector, como ejemplo
    },
    data: [{
        value: Number,
        timestamp: { type: Date, default: Date.now },
    }],
    alerts: [alertSchema],
});

const ultrasonicSchema = new mongoose.Schema({
    parameters: {
    range: { type: Number, required: true } // Para el gasDetector, como ejemplo
    },
    data: [{
        distance: Number,
        timestamp: { type: Date, default: Date.now },
    }],
    alerts: [alertSchema],
});

const temperatureSchema = new mongoose.Schema({
    parameters: {
        max: { type: Number, required: true },
        min: { type: Number, required: true },
    },
    data: [{
        temperature: Number,
        timestamp: { type: Date, default: Date.now },
    }],
    alerts: [alertSchema],
});

// Definir el esquema principal del dispositivo con los esquemas de sensores incorporados
const deviceSchema = new mongoose.Schema({
    adminUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true,
    },
    monitoredUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    room: {
        type: String,
        required: true,
    },
    sensors: {
        gasDetector: gasDetectorSchema,
        ultrasonic: ultrasonicSchema,
        temperature: temperatureSchema,
    },
    graphicScreenMessages: [{
        timestamp: { type: Date, default: Date.now },
        message: String,
        messageType: {
            type: String,
            enum: ['tipo1', 'tipo2'],
        },
    }],
});

module.exports = mongoose.model('Device', deviceSchema);
