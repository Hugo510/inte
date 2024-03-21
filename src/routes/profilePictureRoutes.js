const express = require('express');
const router = express.Router();
const profilePictureController = require('../controller/profilePictureController');

// Rutas para cargar y recuperar imágenes de perfil
router.post('/admin/:id/profile-picture', profilePictureController.uploadProfilePicture('Admin'), profilePictureController.saveProfilePicture);
router.get('/admin/profile-picture/:id', profilePictureController.getProfilePicture);

router.post('/user/:id/profile-picture', profilePictureController.uploadProfilePicture('User'), profilePictureController
