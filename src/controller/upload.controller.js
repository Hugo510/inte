// controller/upload.controller.js
const multer = require('multer');
const storage = multer.memoryStorage(); // Utiliza memoria como almacenamiento temporal
const upload = multer({ storage: storage });

// Controlador para manejar la carga de archivos
exports.uploadProfilePicture = upload.single('profilePic');

// Función para subir la imagen a MongoDB Atlas o a otro servicio de almacenamiento
exports.saveProfilePicture = async (req, res) => {
  // Aquí debes implementar la lógica para guardar la imagen en MongoDB Atlas o en un servicio de almacenamiento
  // Por ejemplo, podrías usar GridFS si eliges almacenar la imagen directamente en MongoDB
};
