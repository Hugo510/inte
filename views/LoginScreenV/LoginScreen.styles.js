// styles/LoginScreenStyles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 25,
        paddingVertical: 40,
        paddingHorizontal: 20,
        width: '90%',
        alignItems: 'center',
    },
    header: {
        fontSize: 30,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subHeader: {
        fontSize: 18,
        color: '#fff',
        marginBottom: 40,
    },
    input: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 20,
        padding: 15,
        marginBottom: 20,
        color: '#000',
    },
    buttonContainer: {
        width: '100%',
        backgroundColor: '#fb5b5a',
        borderRadius: 20,
        padding: 15,
        marginTop: 10,
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
    forgotPassword: {
        color: '#fff',
        marginTop: 15,
    },
    or: {
      color: '#fff',
      fontSize: 16,
      marginTop: 30,
      marginBottom: 30,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
},
socialButton: {
  backgroundColor: '#fff',
  padding: 5,
  borderRadius: 20,
  //width: '45%',
  justifyContent: 'center',
  alignItems: 'center',

    },
    signupContainer: {
        position: 'absolute', // Posicionamiento absoluto para colocarlo en la parte inferior
        bottom: 20, // Espacio desde la parte inferior
        width: '100%', // El contenedor se extiende al ancho completo
        justifyContent: 'center', // Centrado horizontal
        alignItems: 'center', // Centrado vertical
    },
    signupText: {
      color: '#fff',
      fontSize: 16,
  },
  signupButton: {
      color: '#fb5b5a',
      fontWeight: 'bold',
      marginLeft: 5, // Espacio entre el texto "Don't have an account?" y "Sign up"
  },

});
