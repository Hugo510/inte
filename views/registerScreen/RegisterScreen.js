// views/SignUpScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, KeyboardAvoidingView, Platform, Button, Alert } from 'react-native';
import styles from './RegisterScreen.styles'; 
import DatePicker from '@react-native-community/datetimepicker'; // Asegúrate de instalar esta librería
import { RadioButton } from 'react-native-paper'; // Asegúrate de instalar esta librería
//import CheckBox from '@react-native-community/checkbox'; // Asegúrate de instalar esta librería


const RegisterScreen = ({ navigation }) => {
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
        <Text style={styles.title}>Photography.</Text>
        <Text style={styles.subtitle}>JOURNEY EVERYWHERE</Text>
        {/* You can add overlay content here */}

      {/* Form Section */}
      <View style={styles.formContainer}>
        <Text style={styles.header}>Registration</Text>
        <TextInput style={styles.input} placeholder="Name" />
        <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" />

        {/* DatePicker para la fecha de nacimiento */}
        <View style={styles.datePicker}>
        <Button onPress={showDatePicker} title="Choose Date" />
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
          {/* <View style={styles.checkboxContainer}>
            <CheckBox
              disabled={false}
              value={checked}
              onValueChange={(newValue) => setChecked(newValue)}
            />
            <Text style={styles.checkboxLabel}>I have a phone</Text>
          </View> */}

        {/* Add other input fields here */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.confirmButton}>
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        
      </View>
    </View>
    </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
