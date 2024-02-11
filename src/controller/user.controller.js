const User = require('../model/user.model.js');
const { authenticate } = require('../utils/auth.utils');

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
    // Asume que authenticate ahora espera solo un modelo relevante según el tipo de login
    const { token, role } = await authenticate(req.body.email, req.body.password, User);
    res.json({ message: 'User logged in successfully', token, role });
  } catch (error) {
    res.status(401).send(error.message);
  }
};

  const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const updateData = req.body;

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
        if (!updatedUser) {
            return res.status(404).send('User not found');
        }

        res.json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        res.status(400).send(error.message);
    }
};


const deleteUser = async (req, res) => {
  try {
      const userId = req.params.id;
      const deletedUser = await User.findByIdAndDelete(userId);

      if (!deletedUser) {
          return res.status(404).send('User not found');
      }

      res.json({ message: 'User deleted successfully' });
  } catch (error) {
      res.status(500).send(error.message);
  }
};

const getUserById = async (req, res) => {
  try {
      const userId = req.params.id;
      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).send('User not found');
      }

      res.json(user);
  } catch (error) {
      res.status(500).send(error.message);
  }
};


const getUsers = async (req, res) => {
  try {
      const users = await User.find({});
      res.json(users);
  } catch (error) {
      res.status(500).send(error.message);
  }
};


module.exports = {
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
  getUserById,
  getUsers
};

