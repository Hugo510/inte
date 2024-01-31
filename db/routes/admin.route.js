const express = require('express');
const { registerAdmin, getAdmins } = require('../controller/admin.controller.js');
const router = express.Router();

router.post('/registerAdmin', registerAdmin);
router.get('/getAdmins', getAdmins);

module.exports = router;
