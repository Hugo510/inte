const express = require('express');
const morgan = require('morgan');
const userRoutes = require('./routes/user.route');
const adminRoutes = require('./routes/admin.route');
const deviceRoutes = require('./routes/device.route');

const cors = require('cors');
app.use(cors());

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/devices', deviceRoutes);

module.exports = app;
