const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Suponiendo que tienes un SECRET_KEY definido en tus variables de entorno para firmar el token
const SECRET_KEY = process.env.SECRET_KEY;

// Función de autenticación genérica
const authenticateUser = async (email, password, Model) => {
  try {
    const user = await Model.findOne({ email }).exec();
    if (!user) {
      throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Password is incorrect');
    }

    const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
    return token;
  } catch (error) {
    throw error;
  }
};

module.exports = { authenticateUser };
