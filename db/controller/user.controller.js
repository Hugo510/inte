const User = require('../models/user.model.js'); // Asegúrate de que la ruta sea correcta

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

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).send('Usuario no encontrado');
        }

        // Aquí deberías comparar la contraseña proporcionada con la almacenada usando un método seguro
        if (user.password !== password) {
            return res.status(401).send('Contraseña incorrecta');
        }

        res.send('Login exitoso');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
};

module.exports = { register, login };
