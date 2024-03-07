import React, { useState, useRef } from 'react';
import { Animated, View, Text, TextInput, TouchableOpacity, ImageBackground, KeyboardAvoidingView, Platform, Button, Alert, ActivityIndicator } from 'react-native';
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
  const opacity = useRef(new Animated.Value(0)).current;

  const showDatePicker = () => {
    setDatePickerVisibility(true);
    animateOpacity(1);
  };

  const hideDatePicker = () => {
    animateOpacity(0);
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    hideDatePicker();
  };

  const animateOpacity = (toValue) => {
    Animated.timing(opacity, {
      toValue: toValue,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      if (toValue === 0) {
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

        <Formik
          initialValues={{ email: '', password: '', firstName: '', lastName: '', birthDate: new Date() }}
          validationSchema={registerSchema}          
          onSubmit={async (values, { setSubmitting, resetForm  }) => {
            console.log("Inicio del onSubmit"); // Paso 6: Asegurarse que esta parte del código se ejecuta
            setLoading(true);
            const userData = {
              ...values,
              birthDate: date.toISOString(),
              isAdmin,
            };
            
            console.log("Valores a enviar:", userData); // Verificar los valores que se intentan enviar

            const endpoint = isAdmin ? `http://${global.ipDireccion}:3000/api/admins/register` : `http://${global.ipDireccion}:3000/api/users/register`;
            try {
              console.log("Intentando enviar datos al servidor..."); // Paso 6: Confirmar que llegamos a este punto
              const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
              });

              const json = await response.json();
              if (response.ok) {
                Alert.alert('Éxito', 'Usuario registrado correctamente', [
                  { text: "OK", onPress: () => {
                    resetForm();
                    setDate(new Date()); // Reiniciar la fecha también si es parte del formulario
                    setIsAdmin(false); // Reiniciar cualquier otro estado que no esté manejado directamente por Formik
                    // Aquí puedes agregar navegación u otras acciones de limpieza
                  }}
                ]);
              } else {
                Alert.alert('Error', json.message || 'No se pudo registrar el usuario');
              }
            } catch (error) {
              console.error("Error al enviar datos:", error);
              Alert.alert('Error', 'No se pudo conectar al servidor');
            } finally {
              console.log("Finalizando onSubmit");
              setSubmitting(false);
              setLoading(false);
            }
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, touched, errors, setFieldValue }) => (
            <>
              <Text style={styles.header}>Registro</Text>
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

              <View style={styles.checkboxContainer}>
                <Checkbox
                  status={isAdmin ? 'checked' : 'unchecked'}
                  onPress={() => setIsAdmin(!isAdmin)}
                />
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
