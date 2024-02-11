
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Suponiendo que SECRET_KEY es tu clave secreta para JWT
const SECRET_KEY = process.env.JWT_SECRET_KEY;


const authenticate = async (email, password, Model) => {
  try {
    const user = await Model.findOne({ email }).exec();
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Contraseña incorrecta');
    }

    // Aquí asumimos que el modelo tiene un campo 'role', ajusta según tu esquema
    const payload = {
      userId: user._id,
      role: user.role, // Esto permite flexibilidad si decides expandir los roles más allá de 'user' y 'admin'
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

    return { token, role: payload.role };
  } catch (error) {
    throw error;
  }
};


module.exports = { authenticate };
