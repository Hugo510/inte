import React, { useState, useEffect } from 'react';
import { ScrollView, SafeAreaView, TouchableOpacity, Alert, View, Text, ActivityIndicator } from 'react-native';
import { Button, TextInput, Avatar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { launchImageLibrary } from 'react-native-image-picker';
import styles from './editProfileScreen.styles';
import Icon from 'react-native-vector-icons/FontAwesome';

// Esquema de validación actualizado
const ProfileSchema = Yup.object().shape({
  firstName: Yup.string().required('Requerido'),
  lastName: Yup.string().required('Requerido'),
  email: Yup.string().email('Email inválido').required('Requerido'),
  birthdate: Yup.date().max(new Date(), 'La fecha de nacimiento no puede ser en el futuro').required('Requerido'),
});

const EditProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('userId');
      if (!userToken || !userId) {
        Alert.alert("Error", "No se encontró el token de autenticación o el ID del usuario.");
        setLoading(false);
        return;
      }

      const endpoint = `http://${global.ipDireccion}:3000/api/admins/${userId}`;

      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${userToken}`,
          },
        });

        if (response.ok) {
          const json = await response.json();
          const formattedBirthDate = json.birthDate ? json.birthDate.split('T')[0] : '';
          
          setUserData({
            ...json,
            birthdate: formattedBirthDate // Asegúrate de que el campo en tu estado se llame igual que el campo en Formik
          });
          console.log(json)
          setProfileImage(json.profilePicture || '../../assets/images/yo.jpg');
          
        } else {
          const errorMessage = await response.text();
          throw new Error(errorMessage || "Error al obtener datos del perfil.");
        }
      } catch (error) {
        Alert.alert("Error", error.message || "Ocurrió un error inesperado.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

const handleChoosePhoto = () => {
  launchImageLibrary({ mediaType: 'photo', quality: 1, includeBase64: false }, (response) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.errorCode) {
      console.log('ImagePicker Error: ', response.errorMessage);
    } else if (response.assets && response.assets.length > 0) {
      // Assuming you have a state setter named `setProfileImage`
      setProfileImage(response.assets[0].uri);
    }
  });
};


  const handleSubmitForm = async (values) => {
    const userToken = await AsyncStorage.getItem('userToken');
    const userId = await AsyncStorage.getItem('userId');
    const endpoint = `http://${global.ipDireccion}:3000/api/admins/${userId}`;

    try {
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        Alert.alert("Éxito", "Perfil actualizado correctamente.");
      } else {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Error al actualizar el perfil.");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Ocurrió un error inesperado al actualizar.");
    }
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  if (!userData) {
    return <Text>No se pudo obtener los datos del usuario.</Text>;
  }


  return (
    <>
    <View style={styles.headerContainer}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>
      
    <ScrollView style={styles.container}>
      <Formik
        initialValues={{
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          birthdate: userData.birthdate || '',
        }}
        validationSchema={ProfileSchema}
        onSubmit={handleSubmitForm}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
          <View style={styles.avatarContainer}>
            <Avatar.Image size={100} source={require('../../assets/images/yo.jpg')} style={styles.avatar} />
            {/* <Image source={{ uri: profileImage }} style={styles.profilePic} /> require('../../assets/images/yo.jpg' )*/ }
              <Button onPress={handleChoosePhoto}>Cambiar Foto</Button>
            </View>
            
            <TextInput
              label="First Name"
              onChangeText={handleChange('firstName')}
              onBlur={handleBlur('firstName')}
              value={values.firstName}
              style={styles.input}
              error={touched.firstName && errors.firstName}
            />
            <Text style={styles.errorText}>{touched.firstName && errors.firstName ? errors.firstName : ''}</Text>
            <TextInput
              label="Last Name"
              onChangeText={handleChange('lastName')}
              onBlur={handleBlur('lastName')}
              value={values.lastName}
              style={styles.input}
              error={touched.lastName && errors.lastName}
            />
            <Text style={styles.errorText}>{touched.lastName && errors.lastName ? errors.lastName : ''}</Text>
            <TextInput
              label="Email"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              style={styles.input}
              error={touched.email && errors.email}
              keyboardType="email-address"
            />
            <Text style={styles.errorText}>{touched.email && errors.email ? errors.email : ''}</Text>
            <TextInput
              label="Birthdate (YYYY-MM-DD)"
              onChangeText={handleChange('birthdate')}
              onBlur={handleBlur('birthdate')}
              value={values.birthdate}
              style={styles.input}
              error={touched.birthdate && errors.birthdate}
              keyboardType="numeric"
            />
            <Text style={styles.errorText}>{touched.birthdate && errors.birthdate ? errors.birthdate : ''}</Text>
            <Button mode="contained" onPress={handleSubmit} style={styles.button}>
              Save Changes
            </Button>
          </>
        )}
      </Formik>
    </ScrollView>
    </>
  );
};


export default EditProfileScreen;
