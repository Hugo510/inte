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

// Nuevo esquema para el detector de humo
const smokeSchema = new mongoose.Schema({
    parameters: {
        max: { type: Number, required: true } // Máximo nivel de partículas (\(\mu g/m^3\)) permitido antes de generar una alerta
    },
    data: [{
        concentration: { type: Number }, // Concentración de partículas en \(\mu g/m^3\)
        timestamp: { type: Date, default: Date.now },
    }],
    alerts: [alertSchema],
});

const gasDetectorSchema = new mongoose.Schema({
    parameters: {
        sensitivity: { type: Number, required: true } // Sensibilidad del sensor en partes por millón (ppm)
    },
    data: [{
        concentration: { type: Number }, // Concentración de gas en ppm
        timestamp: { type: Date, default: Date.now },
    }],
    alerts: [alertSchema],
});

const ultrasonicSchema = new mongoose.Schema({
    parameters: {
        range: { type: Number, required: true } // Rango máximo de detección en metros (m)
    },
    data: [{
        distance: { type: Number }, // Distancia medida en metros (m)
        timestamp: { type: Date, default: Date.now },
    }],
    alerts: [alertSchema],
});

const humiditySchema = new mongoose.Schema({
    parameters: {
        max: { type: Number, required: true },
        min: { type: Number, required: true },
    },
    data: [{
        humidity: { type: Number }, // Humedad relativa en porcentaje (%)
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
        temperature: { type: Number }, // Temperatura en grados Celsius (°C)
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
        humidity: humiditySchema,
        smoke: smokeSchema,
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
