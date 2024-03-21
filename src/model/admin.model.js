const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true // Elimina los espacios al inicio y al final
    },
    lastName: {
        type: String,
        required: true,
        trim: true // Elimina los espacios al inicio y al final
    },
    email: {
        type: String,
        required: true,
        trim: true,  
        unique: true,
        index: true, // Asegura que el campo email esté indexado
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: false,
    },
    birthDate: {
        type: Date,
        required: true,
    },
    profilePictureId: {
        type: String,
    },
    role: {
        type: String,
        default: 'admin',
    },
    monitoredUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }],   
    sentMonitoringRequests: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        deviceId: { // Añadido para especificar a qué dispositivo se refiere la solicitud
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Device',
            required: false
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending'
        },
        sentAt: {
            type: Date,
            default: Date.now
        }
    }],
    fcmToken: {
        type: String,
        required: false // this can be optional because not every user may have a token initially
    }
});

module.exports = mongoose.model('Admin', adminSchema);
