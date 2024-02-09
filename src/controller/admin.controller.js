const Admin = require('../model/admin.model.js'); // Asegúrate de que el nombre del archivo y la ruta sean correctos
const { authenticateUser } = require('../utils/auth.utils');

const loginAdmin = async (req, res) => {
    try {
      // Llamar a la función de autenticación común con el modelo de administrador correspondiente
      // Se corrige AdminModel por Admin, que es el nombre correcto de la variable que referencia al modelo de Mongoose
      const token = await authenticateUser(req.body.email, req.body.password, Admin);
      res.json({ message: 'Admin logged in successfully', token });
    } catch (error) {
      res.status(401).send(error.message);
    }
};

const registerAdmin = async (req, res) => {
    try {
      // Crear una instancia del modelo Admin con los datos de la solicitud
      // Aquí también se corrige AdminModel por Admin
      const newAdmin = new Admin(req.body);
  
      // Guardar el administrador en la base de datos
      const savedAdmin = await newAdmin.save();
  
      res.status(201).json({ message: 'Admin registered successfully', admin: savedAdmin });
    } catch (error) {
      // Manejar errores, como email duplicado
      res.status(400).send(error.message);
    }
};

const getAdmins = async (req, res) => {
    try {
        // Utiliza directamente Admin para hacer la consulta
        const admins = await Admin.find({});
        res.send(admins);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los administradores');
    }
};

const updateAdmin = async (req, res) => {
  try {
      const adminId = req.params.id;
      const updateData = req.body;

      const updatedAdmin = await Admin.findByIdAndUpdate(adminId, updateData, { new: true });
      if (!updatedAdmin) {
          return res.status(404).send('Admin no encontrado');
      }

      res.json({ message: 'Admin actualizado correctamente', admin: updatedAdmin });
  } catch (error) {
      res.status(400).send(error.message);
  }
};

const deleteAdmin = async (req, res) => {
  try {
      const adminId = req.params.id;
      const deletedAdmin = await Admin.findByIdAndDelete(adminId);

      if (!deletedAdmin) {
          return res.status(404).send('Admin no encontrado');
      }

      res.json({ message: 'Admin eliminado correctamente' });
  } catch (error) {
      res.status(500).send(error.message);
  }
};

const getAdminById = async (req, res) => {
  try {
      const adminId = req.params.id;
      const admin = await Admin.findById(adminId);

      if (!admin) {
          return res.status(404).send('Admin no encontrado');
      }

      res.json(admin);
  } catch (error) {
      res.status(500).send(error.message);
  }
};



module.exports = {
  registerAdmin,
  loginAdmin,
  getAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin
};
