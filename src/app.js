const morgan = require('morgan');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const { errors } = require('celebrate');

const userRoutes = require('./routes/user.route');
const adminRoutes = require('./routes/admin.route');
const deviceRoutes = require('./routes/device.route');
const { login } = require('./utils/auth.utils.js');
// const profilePictureRoutes = require('./routes/profilePicture.route');

const app = express();

app.use(helmet());
app.use(cors());
app.use(hpp());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // límite de 100 solicitudes por IP
});
app.use(limiter);

// Rutas aquí
app.use('/api/users', userRoutes);
app.use('/api/login', login);
app.use('/api/admins', adminRoutes);
app.use('/api/devices', deviceRoutes);
// app.use('/api/pictures', profilePictureRoutes);

app.use(errors()); // Celebrate error handler

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = app;
