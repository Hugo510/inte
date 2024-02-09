const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Suponiendo que SECRET_KEY es tu clave secreta para JWT
const SECRET_KEY = process.env.JWT_SECRET_KEY;

const authenticate = async (email, password, UserModel, AdminModel) => {
  try {
    let user = await UserModel.findOne({ email }).exec();
    let isUser = true;

    if (!user) {
      user = await AdminModel.findOne({ email }).exec();
      isUser = false;
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Contraseña incorrecta');
    }

    const payload = {
      userId: user._id,
      role: isUser ? 'user' : 'admin', // Asume que tienes un campo 'role' o ajusta según tu modelo
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

    return { token, role: payload.role };
  } catch (error) {
    throw error;
  }
};

module.exports = { authenticateUser };
