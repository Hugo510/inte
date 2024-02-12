const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
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
        required: true,
    },
    birthDate: {
        type: Date,
        required: true,
    },
    profilePictureUrl: {
        type: String,
    },
    role: {
        type: String,
        default: 'admin',
    },
    sentMonitoringRequests: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
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
});

module.exports = mongoose.model('Admin', adminSchema);
