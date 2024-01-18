// views/LoginScreen.js
import React from 'react';
import { Text, View, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../LoginScreenV/LoginScreen.styles'; // Importa estilos específicos para la pantalla de inicio de sesión

const LoginScreen = () => {
    return <LinearGradient
    // Colores del degradado
    colors={['#8EC5FC', '#E0C3FC']}
    // Estilo para que el degradado cubra toda la pantalla
    style={styles.container}
  >
    <View style={styles.content}>
      <Text style={styles.header}>Login</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
      />
      
      <TouchableOpacity style={styles.buttonContainer}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      
      <Text style={styles.forgotPassword}>Forgot your password?</Text>
      
      <Text style={styles.or}>or connect with</Text>
      
      <View style={styles.socialButtons}>
        <TouchableOpacity style={[styles.socialButton, styles.facebookButton]}>
          <Text style={styles.socialText}>Facebook</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.socialButton, styles.twitterButton]}>
          <Text style={styles.socialText}>Twitter</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account?</Text>
        <TouchableOpacity>
          <Text style={styles.signupButton}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  </LinearGradient>
};

export default LoginScreen;
