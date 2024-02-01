const express = require('express');
const { addDevice, getDevices } = require('../controller/device.controller.js');
const router = express.Router();

router.post('/addDevice', addDevice);
router.get('/getDevices', getDevices);

module.exports = router;
