// views/LoginScreen.js
import React from 'react';
import { Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../LoginScreenV/LoginScreen.styles'; // Asegúrate de que la ruta sea correcta
import Icon from 'react-native-vector-icons/MaterialIcons';

const LoginScreen = ({ navigation }) => {
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
                />
                
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    placeholderTextColor="#b1b1b1"
                />
                
                <TouchableOpacity style={styles.buttonContainer}>
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
