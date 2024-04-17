const mongoose = require('mongoose');

const Device = require('./device.model.js'); 
const User = require('./user.model.js'); 

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
    fcmToken: {
        type: String,
        required: false // this can be optional because not every user may have a token initially
    }
});


adminSchema.pre('save', function(next) {
    if (!this.sentMonitoringRequests.every(request => request.userId && request.deviceId)) {
        next(new Error('Every monitoring request must have both userId and deviceId specified.'));
    } else {
        next();
    }
});

adminSchema.pre('updateOne', { document: true, query: false }, function(next) {
    if (this._update.sentMonitoringRequests && !this._update.sentMonitoringRequests.every(request => request.userId && request.deviceId)) {
        next(new Error('Every monitoring request in update must have both userId and deviceId specified.'));
    } else {
        next();
    }
});

adminSchema.pre('save', async function(next) {
    try {
        // Verifica que cada userId referenciado exista
        for (let request of this.sentMonitoringRequests) {
            const userExists = await User.exists({ _id: request.userId });
            if (!userExists) {
                return next(new Error('User ID referenced does not exist'));
            }

            const deviceExists = await Device.exists({ _id: request.deviceId });
            if (!deviceExists) {
                return next(new Error('Device ID referenced does not exist'));
            }
        }
        next();
    } catch (err) {
        next(err);
    }
});

adminSchema.pre('updateOne', { document: true, query: false }, async function(next) {
    try {
        if (this._update.sentMonitoringRequests) {
            for (let request of this._update.sentMonitoringRequests) {
                const userExists = await User.exists({ _id: request.userId });
                if (!userExists) {
                    return next(new Error('User ID referenced does not exist'));
                }

                const deviceExists = await Device.exists({ _id: request.deviceId });
                if (!deviceExists) {
                    return next(new Error('Device ID referenced does not exist'));
                }
            }
        }
        next();
    } catch (err) {
        next(err);
    }
});


module.exports = mongoose.model('Admin', adminSchema);
