const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,  
        unique: true
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
        default: 'monitor',
    },
    adminUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },
});

module.exports = mongoose.model('User', userSchema);
