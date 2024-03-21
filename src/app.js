const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const userRoutes = require('./routes/user.route');
const adminRoutes = require('./routes/admin.route');
const deviceRoutes = require('./routes/device.route');
const { login } = require('./utils/auth.utils.js');
const profilePictureRoutes = require('./routes/profilePicture.routes');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/login', login);
app.use('/api/admins', adminRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/pictures', profilePictureRoutes);


module.exports = app;
