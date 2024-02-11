const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const userSchema = new mongoose.Schema({
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
        default: 'monitor',
    },
    monitoringRequests: [{
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin'
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending'
        }
    }]
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});



// Método para comparar contraseñas (útil para autenticación)
userSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};


module.exports = mongoose.model('User', userSchema);
