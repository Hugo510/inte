import React, { useState, useRef } from 'react';
import { Animated,View, Text, TextInput, TouchableOpacity, ImageBackground, KeyboardAvoidingView, Platform, Button, Alert, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import DatePicker from '@react-native-community/datetimepicker';
import { Checkbox } from 'react-native-paper';
import styles from './RegisterScreen.styles';

// Esquema de validación con Yup
const registerSchema = Yup.object().shape({
  email: Yup.string().email('Correo inválido').required('Correo es requerido'),
  password: Yup.string().min(8, 'La contraseña debe tener al menos 8 caracteres').required('Contraseña es requerida'),
  firstName: Yup.string().required('Nombre es requerido'),
  lastName: Yup.string().required('Apellido es requerido'),
  birthDate: Yup.date()
  .max(new Date(), "No puedes seleccionar una fecha futura")
  .required("La fecha de nacimiento es requerida"),
});

const RegisterScreen = ({ navigation }) => {
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [date, setDate] = React.useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current; // Inicializa la opacidad a 0

  const showDatePicker = () => {
    setDatePickerVisibility(true);
    animateOpacity(1); // Comienza a aparecer
  };
  
  const hideDatePicker = () => {
    animateOpacity(0); // Comienza a desaparecer
  };
  

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    hideDatePicker();
  };

  const animateOpacity = (toValue) => {
    Animated.timing(opacity, {
      toValue: toValue, // Animar hacia el valor objetivo (1 para mostrar, 0 para ocultar)
      duration: 500, // Duración de la animación
      useNativeDriver: true,
    }).start(() => {
      if (toValue === 0) {
        // Una vez que la animación de desaparecer completa, oculta el DatePicker
        setDatePickerVisibility(false);
      }
    });
  };
  

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ImageBackground
        source={require('../../assets/images/background.jpg')}
        style={styles.imageContainer}
      >

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.navBack}>&lt;</Text>
          </TouchableOpacity>
      
        <Text style={styles.title}>Air Guard.</Text>
        <Text style={styles.subtitle}>¿Listo para dar el paso?</Text>
        {/* You can add overlay content here */}

        {/* Contenido del ImageBackground */}
        <Formik
          initialValues={{ email: '', password: '', firstName: '', lastName: '', birthDate: new Date() }}
          validationSchema={registerSchema}          
          onSubmit={async (values, { setSubmitting }) => {
            setLoading(true); // Inicia el indicador de carga
            const userData = {
              ...values,
              birthDate: date.toISOString(),
              isAdmin,
            };

            const endpoint = isAdmin ? `http://${global.ipDireccion}:3000/api/admins/register` : `http://${global.ipDireccion}:3000/api/users/register`;
            try {
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
              setSubmitting(false); // Finaliza el estado de envío de Formik
              setLoading(false); // Finalizar la carga
            }
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, touched, errors, setFieldValue }) => (
            <>
            <Text style={styles.header}>Registro</Text>
              {/* Inputs del formulario */}
              <TextInput
                style={[styles.input, touched.email && errors.email ? styles.errorInput : null]}
                placeholder="Email"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
              />
              {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

              <TextInput
                style={[styles.input, touched.password && errors.password ? styles.errorInput : null]}
                placeholder="Password"
                secureTextEntry={true}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
              />
              {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

              <TextInput
                style={[styles.input, touched.firstName && errors.firstName ? styles.errorInput : null]}
                placeholder="Nombre"
                onChangeText={handleChange('firstName')}
                onBlur={handleBlur('firstName')}
                value={values.firstName}
              />
              {touched.firstName && errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}

              <TextInput
                style={[styles.input, touched.lastName && errors.lastName ? styles.errorInput : null]}
                placeholder="Apellidos"
                onChangeText={handleChange('lastName')}
                onBlur={handleBlur('lastName')}
                value={values.lastName}
              />
              {touched.lastName && errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}


                      {/* DatePicker para la fecha de nacimiento */}
                      <Button onPress={showDatePicker} title="Escoge una fecha de nacimiento" />
                        {isDatePickerVisible && (
                          <Animated.View style={[{ opacity }, isDatePickerVisible ? styles.visibleDatePicker : styles.hiddenDatePicker]}>
                            <DatePicker
                              value={date}
                              mode="date"
                              display="default"
                              onChange={onChangeDate}
                            />
                          </Animated.View>                        
                        )}


                     {/* Checkbox para Administrador */}
                    {/* Actualiza el estado de isAdmin directamente cuando el checkbox es presionado */}
                  <View style={styles.checkboxContainer}>
                    <Checkbox
                      status={isAdmin ? 'checked' : 'unchecked'}
                      onPress={() => setIsAdmin(!isAdmin)}
                    />
                    <Text>Es administrador</Text>
                  </View>
                  
              <Button
                onPress={handleSubmit}
                title={loading ? "Cargando..." : "Registrar"}
                disabled={loading}
              />

            </>
          )}
        </Formik>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
