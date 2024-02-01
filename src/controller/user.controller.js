const User = require('../model/user.model.js');
const { authenticateUser } = require('../utils/auth.utils');

const registerUser = async (req, res) => {
  try {
    // Crear una instancia del modelo User con los datos de la solicitud
    const newUser = new User(req.body);

    // Guardar el usuario en la base de datos
    const savedUser = await newUser.save();

    res.status(201).json({ message: 'User registered successfully', user: savedUser });
  } catch (error) {
    // Manejar errores, como email duplicado
    res.status(400).send(error.message);
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

module.exports = { registerUser, loginUser };
