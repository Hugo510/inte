const User = require('../models/user.model.js');
const { authenticateUser } = require('../utils/auth.utils');

const register = async (req, res) => {
    const {
        password,
        gender,
        username,
        phone,
        fechaNacimiento,
        firstName,
        lastName
    } = req.body;    
    
    try {
        const newUser = new User({
            username,
            password, // En una aplicación real, deberías hashear esta contraseña antes de guardarla
            gender,
            fechaNacimiento,
            phone,
            lastName,
            firstName
        });

        const savedUser = await newUser.save();
        res.send(savedUser);
    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error al registrar el usuario');
    }
};

const loginUser = async (req, res) => {
    try {
      // Llamar a la función de autenticación común con el modelo de usuario correspondiente
      const token = await authenticateUser(req.body.email, req.body.password, UserModel);
      res.json({ message: 'User logged in successfully', token });
    } catch (error) {
      res.status(401).send(error.message);
    }
  };

module.exports = { register, loginUser };
