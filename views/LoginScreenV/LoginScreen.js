// views/LoginScreen.js
import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../LoginScreenV/LoginScreen.styles'; // Asegúrate de que la ruta sea correcta
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        const endpoint = 'http://192.168.1.30:3000/api/login'; // Endpoint unificado para login
        
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });
  
            if (response.ok && response.headers.get('Content-Type')?.includes('application/json')) {
                const json = await response.json();
                console.log('Login exitoso:', json);
                await AsyncStorage.setItem('userToken', json.token);
                await AsyncStorage.setItem('userRole', json.role);
                await AsyncStorage.setItem('userId', json.userId.toString()); // Asegúrate de que es una cadena
                
                // Navega a la pantalla correspondiente basada en el rol
                if (json.role === 'admin') {
                    navigation.navigate('Profile'); // Asume que tienes una pantalla de dashboard para admin
                } else {
                    navigation.navigate('UserDashboard'); // Asume que tienes una pantalla para usuarios
                }
            } else {
                const errorMessage = await response.text();
                Alert.alert('Error', errorMessage || 'Ocurrió un error al intentar iniciar sesión');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo completar la solicitud. Por favor, verifica tu conexión y vuelve a intentarlo.');
        }
    };

    return (
        <LinearGradient
            colors={['#8EC5FC', '#E0C3FC']}
            style={styles.container}
        >
            <View style={styles.contentContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.navBack}>&lt;</Text>
        </TouchableOpacity>
                <Text style={styles.header}>Welcome</Text>
                <Text style={styles.subHeader}>Sign in to continue</Text>
                
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    keyboardType="email-address"
                    placeholderTextColor="#b1b1b1"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                />
                
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#b1b1b1"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                
                {/* <Switch
                    value={isAdmin}
                    onValueChange={(newValue) => setIsAdmin(newValue)}
                    color="#6200ee"
                />
                <Text>{isAdmin ? 'Iniciar sesión como Admin' : 'Iniciar sesión como Usuario'}</Text> */}
                

                <TouchableOpacity style={styles.buttonContainer} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Sign in</Text>
                </TouchableOpacity>
                
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </View>
            
            <Text style={styles.or}>OR</Text>
            
            <View style={styles.socialButtons}>
                <TouchableOpacity style={styles.socialButton}>
                <Icon name="facebook" size={30} color={styles.iconColor} />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.socialButton}>
                <Icon name="face" size={30} color={styles.iconColor} />
                </TouchableOpacity>
            </View>
            
            <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Don't have an Account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.signupButton}>Sign up</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
};

export default LoginScreen;

/* 
{
   "email": "nuevoemail@admin.com",
   "password": "NuevaContraseña1234"
}

*/