// controller/profilePictureController.js
const upload = require('../utils/gridfs.js');
const mongoose = require('mongoose');
const Admin = require('../model/admin'); // Asegúrate de ajustar la ruta al modelo
const User = require('../model/user'); // Asegúrate de ajustar la ruta al modelo
const gridfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'profilePics'
});

exports.uploadProfilePicture = (model) => upload.single('image');

exports.saveProfilePicture = async (req, res, next) => {
  try {
    const Model = req.url.includes('/admin/') ? Admin : User;
    const modelId = req.params.id; // Asume que la URL tiene un parámetro 'id'
    const profilePictureId = req.file.id; // ID del archivo almacenado en GridFS

    await Model.findByIdAndUpdate(modelId, { profilePictureId });
    res.status(200).json({ message: 'Imagen subida y asociada con éxito.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al subir la imagen.' });
  }
};

exports.getProfilePicture = async (req, res, next) => {
  try {
    const profilePictureId = req.params.id; // Asume que la URL tiene un parámetro 'id'
    
    gridfsBucket.openDownloadStream(mongoose.Types.ObjectId(profilePictureId)).pipe(res);
  } catch (error) {
    res.status(500).json({ message: 'Error al recuperar la imagen.' });
  }
};
