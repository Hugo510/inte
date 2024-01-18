import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const App = () => {
  return (
    <LinearGradient
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    marginBottom: 30,
    color: '#333',
  },
  input: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 20,
    borderRadius: 10,
  },
  buttonContainer: {
    backgroundColor: '#7a42f4',
    padding: 15,
    borderRadius: 10,
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  forgotPassword: {
    color: 'blue',
    marginTop: 15,
  },
  or: {
    marginTop: 20,
    marginBottom: 20,
    color: '#333',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
  socialButton: {
    padding: 15,
    borderRadius: 10,
    width: '40%',
  },
  facebookButton: {
    backgroundColor: '#3b5998',
  },
  twitterButton: {
    backgroundColor: '#00acee',
  },
  socialText: {
    color: '#fff',
    textAlign: 'center',
  },
  signupContainer: {
    marginTop: 20,
    flexDirection: 'row',
  },
  signupText: {
    marginRight: 5,
    color: '#333',
  },
  signupButton: {
    color: 'blue',
  },
});

export default App;
