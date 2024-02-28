const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
    adminUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    monitoredUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    room: {
        type: String,
        required: true
    },
    sensors: {
        gasDetector: {
            parameters: Object,
            alerts: [{
                timestamp: { type: Date, default: Date.now },
                message: String,
                messageType: {
                    type: String,
                    enum: ['Alerta', 'Advertencia', 'Error'], // Ajusta según tus necesidades
                }
                // Agrega más campos si es necesario
            }]
        },
        ultrasonic: {
            parameters: Object,
            alerts: [{
                timestamp: { type: Date, default: Date.now },
                message: String,
                messageType: {
                    type: String,
                    enum: ['Alerta', 'Advertencia', 'Error'], // Ajusta según tus necesidades
                }
                // Agrega más campos si es necesario
            }]
        },
        temperature: {
            parameters: Object,
            alerts: [{
                timestamp: { type: Date, default: Date.now },
                message: String,
                messageType: {
                    type: String,
                    enum: ['Alerta', 'Advertencia', 'Error'], // Ajusta según tus necesidades
                }
                // Agrega más campos si es necesario
            }]
        }
    },
    graphicScreenMessages: [{
        timestamp: { type: Date, default: Date.now },
        message: String,
        messageType: {
            type: String,
            enum: ['tipo1', 'tipo2'], // Ejemplo de tipos, ajusta según necesidad
        }
    }]
});

module.exports = mongoose.model('Device', deviceSchema);
