const mongoose = require('mongoose');
const { GridFsStorage } = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');
const multer = require('multer');

const dbURI = process.env.MONGODB_URI; // Asegúrate de tener esta variable en tu archivo .env

const storage = new GridFsStorage({
  url: dbURI,
  options: { useUnifiedTopology: true, useNewUrlParser: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'profilePics' // Cambia 'profilePics' al nombre del bucket que quieras
        };
        resolve(fileInfo);
      });
    });
  }
});

const upload = multer({ storage });

module.exports = upload;
