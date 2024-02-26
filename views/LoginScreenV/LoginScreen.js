// views/LoginScreen.js
import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, Switch, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../LoginScreenV/LoginScreen.styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisibility, setPasswordVisibility] = useState(true);
    const togglePasswordVisibility = () => setPasswordVisibility(!passwordVisibility);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLogin = async () => {
        const endpoint = `http://${global.ipDireccion}:3000/api/login`; // Endpoint unificado para login
        
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
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex: 1}}>
            <LinearGradient colors={['#8EC5FC', '#E0C3FC']} style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                <View style={styles.contentContainer}>
                    
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
                        secureTextEntry={passwordVisibility}
                    />
                    <TouchableOpacity onPress={() => setPasswordVisibility(!passwordVisibility)} style={styles.visibilityToggle}>
                        <Icon name={passwordVisibility ? "visibility-off" : "visibility"} size={20} color="#6e6e6e" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonContainer} onPress={handleLogin} disabled={isSubmitting}>
                        <Text style={styles.buttonText}>Sign in</Text>
                    </TouchableOpacity>
                    {isSubmitting && <ActivityIndicator size="small" color="#0000ff" />}
                    
                    <Text style={styles.forgotPassword}>Forgot Password?</Text>
                </View>

                <Text style={styles.or}>OR</Text>

                <View style={styles.socialButtons}>
                    <TouchableOpacity style={styles.socialButton}>
                        <Icon name="facebook" size={30} color="#3b5998" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialButton}>
                        <Icon name="face" size={30} color="#DB4437" />
                    </TouchableOpacity>
                </View>

                <View style={styles.signupContainer}>
                    <Text style={styles.signupText}>Don't have an Account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text style={styles.signupButton}>Sign up</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;

/* 
{
   "email": "nuevoemail@admin.com",
   "password": "NuevaContraseña1234"
}

*/