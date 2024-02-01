// views/RegisterScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, KeyboardAvoidingView, Platform, Button, Alert } from 'react-native';
import styles from './RegisterScreen.styles'; 
import DatePicker from '@react-native-community/datetimepicker'; // Asegúrate de instalar esta librería
import { RadioButton, Checkbox  } from 'react-native-paper'; // Asegúrate de instalar esta librería
//import CheckBox from '@react-native-community/checkbox'; // Asegúrate de instalar esta librería


const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

    const [date, setDate] = useState(new Date());
    const [gender, setGender] = useState('male');
    const [checked, setChecked] = useState(false);

    // Función para manejar el cambio de fecha
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  // Funciones para mostrar y ocultar el DatePicker
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    hideDatePicker();
  };

  const handleRegister = async () => {
    // Crear el objeto de datos del usuario para enviar
    const userData = {
      name,
      email,
      password, // Asegúrate de tener un campo de contraseña en tu formulario
      birthDate: date.toISOString(),
      gender,
      hasPhone: checked,
    };
  
    try {
      const response = await fetch('http://localhost:3000/api/admins/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      const json = await response.json();
      if (response.ok) {
        // Registro exitoso
        Alert.alert('Éxito', 'Usuario registrado correctamente');
        // Opcional: Navegar a la pantalla de inicio de sesión o a la pantalla principal
      } else {
        // Error en el registro
        Alert.alert('Error', json.message || 'No se pudo registrar el usuario');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo conectar al servidor');
    }
  };


  return (
    
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      
      {/* Image Section */}
      <ImageBackground
        source={require('../../assets/images/background.jpg')} // Replace with your image path
        style={styles.imageContainer}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.navBack}>&lt;</Text>
          </TouchableOpacity>
        
        <Text style={styles.title}>Air Guard.</Text>
        <Text style={styles.subtitle}>¿Listo para dar el paso?</Text>
        {/* You can add overlay content here */}

      {/* Form Section */}
      <View style={styles.formContainer}>
        <Text style={styles.header}>Registro</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={name}
          onChangeText={setName} // Actualiza el estado del nombre
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail} // Actualiza el estado del email
        />

        {/* DatePicker para la fecha de nacimiento */}
        <View style={styles.datePicker}>
        <Button onPress={showDatePicker} title="Escoge una fecha" />
        {/* DatePicker condicional */}
        {isDatePickerVisible && (
          <DatePicker
            value={date}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}
      </View>

          {/* RadioButton para seleccionar el género */}
          <RadioButton.Group onValueChange={value => setGender(value)} value={gender}>
            <View>
              <Text>Male</Text>
              <RadioButton value="male" />
            </View>
            <View>
              <Text>Female</Text>
              <RadioButton value="female" />
            </View>
          </RadioButton.Group>

          {/* CheckBox para el teléfono */}
          <View style={styles.checkboxContainer}>
          <Checkbox
                            status={checked ? 'checked' : 'unchecked'}
                            onPress={() => setChecked(!checked)}
                            color={styles.checkboxColor} // Define tu color en styles
                        />
            <Text style={styles.checkboxLabel}>I have a phone</Text>
          </View>

        {/* Add other input fields here */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.confirmButton} onPress={handleRegister}>
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        
      </View>
    </View>
    </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
