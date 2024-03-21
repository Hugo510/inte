const express = require('express');
const router = express.Router();
const profilePictureController = require('../controller/profilePictureController');

// Rutas para cargar y recuperar imágenes de perfil
router.post('/admin/:id/profile-picture', profilePictureController.uploadProfilePicture('Admin'), profilePictureController.saveProfilePicture);
// Ruta para obtener la imagen de perfil de Admin
router.get('/admin/profile-picture/:id', profilePictureController.getProfilePicture('Admin'));

// Ruta para obtener la imagen de perfil de User
router.get('/user/profile-picture/:id', profilePictureController.getProfilePicture('User'));

router.post('/user/:id/profile-picture', profilePictureController.uploadProfilePicture('User'), profilePictureController
