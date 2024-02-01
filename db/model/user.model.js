const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

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

userSchema.pre('save', function(next) {
    let user = this;
  
    // solo hashea la contraseña si ha sido modificada (o es nueva)
    if (!user.isModified('password')) return next();
  
    // genera un salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      if (err) return next(err);
  
      // hashea la contraseña usando el nuevo salt
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);
  
        // sobrescribe la contraseña escrita con el hash
        user.password = hash;
        next();
      });
    });
  });


// Método para comparar contraseñas (útil para autenticación)
userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      if (err) return cb(err);
      cb(null, isMatch);
    });
  };

module.exports = mongoose.model('User', userSchema);
