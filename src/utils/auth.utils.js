const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Suponiendo que SECRET_KEY es tu clave secreta para JWT
const SECRET_KEY = process.env.JWT_SECRET_KEY;

const Admin = require('../model/admin.model.js'); // Asegúrate de que el nombre del archivo y la ruta sean correctos
const User = require('../model/user.model.js');

// Función authenticate existente
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

    const payload = {
      userId: user._id,
      role: user.role,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

    return { token, role: payload.role, userId: user._id };
  } catch (error) {
    throw error;
  }
};

// Función hipotética para obtener el rol del usuario por correo electrónico
const getUserRoleByEmail = async (email) => {
  let user = await User.findOne({ email: email }).exec();
  if (user) return 'user'; // Asumiendo que el rol está definido en el documento del usuario

  let admin = await Admin.findOne({ email: email }).exec();
  if (admin) return 'admin'; // Asumiendo que el rol está definido en el documento del administrador

  throw new Error('Usuario no encontrado');
};


// Función unificada de login que maneja ambos roles
const login = async (req, res) => {
  try {
      const { email, password } = req.body;
      const role = await getUserRoleByEmail(email); // Determina el rol del usuario

      let Model;
      if (role === 'admin') {
          Model = Admin;
      } else if (role === 'user') {
          Model = User;
      } else {
          throw new Error('Rol desconocido');
      }

      // Llama a authenticate con el modelo correcto
      const { token, role: authenticatedRole, userId  } = await authenticate(email, password, Model);

      // Responde al cliente con el token y el rol
      res.json({
        message: `${authenticatedRole} logged in successfully`,
        token,
        role: authenticatedRole,
        userId  // Asegúrate de que este campo coincida con cómo lo maneja tu cliente
    });
  } catch (error) {
      // Manejo de errores como usuario no encontrado o contraseña incorrecta
      res.status(401).send(error.message);
  }
};

module.exports = { authenticate, login };
