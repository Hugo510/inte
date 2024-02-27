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
        smokeDetector: {
            parameters: Object
        },
        infrared: {
            parameters: Object
        },
        temperature: {
            parameters: Object
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
