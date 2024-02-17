// views/RegisterScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, KeyboardAvoidingView, Platform, Button, Alert, ActivityIndicator } from 'react-native';
import styles from './RegisterScreen.styles';
import DatePicker from '@react-native-community/datetimepicker';
import { RadioButton, Checkbox } from 'react-native-paper';


const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [date, setDate] = useState(new Date());
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false); // Nuevo estado para manejar la carga

    // Función para manejar el cambio de fecha
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const validateForm = () => {
      if (!email || !password || !age) {
        Alert.alert('Error', 'Por favor, rellena todos los campos.');
        return false;
      }
      if (isNaN(age) || age < 18) {
        Alert.alert('Error', 'La edad debe ser un número y mayor o igual a 18.');
        return false;
      }
      // Implementa aquí más validaciones según sea necesario
      return true;
    };
  


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
    if (!validateForm()) return; // Detener si la validación falla

    setLoading(true); // Iniciar la carga
    const userData = {
      email,
      password: password, // Considera usar hashing o alguna medida de seguridad aquí
      age,
      birthDate: date.toISOString(),
      isAdmin,
    };

    const endpoint = isAdmin ? 'http://localhost:3000/api/admins/register' : 'http://localhost:3000/api/users/register';
  
    try  {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const json = await response.json();
      if (response.ok) {
        Alert.alert('Éxito', 'Usuario registrado correctamente');
        // Implementa la navegación o la limpieza del formulario aquí
      } else {
        Alert.alert('Error', json.message || 'No se pudo registrar el usuario');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar al servidor');
    } finally {
      setLoading(false); // Finalizar la carga
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
          {loading && <ActivityIndicator size="large" color="#0000ff" />} {/* Indicador de carga */}
        <Text style={styles.title}>Air Guard.</Text>
        <Text style={styles.subtitle}>¿Listo para dar el paso?</Text>
        {/* You can add overlay content here */}

      {/* Form Section */}
      <View style={styles.formContainer}>
        <Text style={styles.header}>Registro</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail} // Actualiza el estado del email
          autoCapitalize="none" // Mejora para evitar la capitalización automática
          />

        <TextInput
          style={styles.input}
          placeholder="Edad"
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
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
{/*           <RadioButton.Group onValueChange={value => setGender(value)} value={gender}>
            <View>
              <Text>Male</Text>
              <RadioButton value="male" />
            </View>
            <View>
              <Text>Female</Text>
              <RadioButton value="female" />
            </View>
          </RadioButton.Group> */}

        <View style={styles.checkboxContainer}>
          <Checkbox
            status={isAdmin ? 'checked' : 'unchecked'}
            onPress={() => setIsAdmin(!isAdmin)}
          />
          <Text style={styles.checkboxLabel}>Es Usuario Administrador</Text>
        </View>

        {/* Add other input fields here */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        <TouchableOpacity onPress={handleRegister} style={styles.confirmButton} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Registrando...' : 'Confirmar'}</Text>
        </TouchableOpacity>
        
      </View>
    </View>
    </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
