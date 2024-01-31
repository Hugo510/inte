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
    }
});

module.exports = mongoose.model('Device', deviceSchema);
