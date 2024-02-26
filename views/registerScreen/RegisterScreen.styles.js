// styles/SignUpScreenStyles.js
import { StyleSheet, Dimensions } from 'react-native';
import { globalStyles } from '../../styles/globalStyles'; // Asegúrate de que la ruta es correcta


const { width, height } = Dimensions.get('window');


// styles/SignUpScreenStyles.js
export default StyleSheet.create({
  container: {
    flex: 1,

  },
  backButton: {
    position: 'absolute', // Posicionamiento absoluto
    top: 10, // Ajusta según sea necesario
    left: 10, // Ajusta según sea necesario
    
},
navBack: {
  fontSize: 39, // Aumenta el tamaño del ícono
  color: 'white', // Cambia el color según tus preferencias
  marginTop: 10,
  marginLeft: 17,
},
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 80,
    position: 'relative', // Agrega esto para permitir el posicionamiento absoluto
},
    title: {
      ...globalStyles.defaultFont,
      fontSize: 48,
      fontWeight: 'bold',
      color: 'white',
    },
    subtitle: {
      fontSize: 20,
      color: 'white',
      marginBottom: 20,
    },
    formContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: width * 0.9, // El formulario ocupa el 90% del ancho de la pantalla
        maxWidth: 500, // Max width for larger devices
        alignItems: 'center',
        shadowColor: '#000', // Sombra para iOS
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5, // Sombra para Android
      },
      header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
      },
    input: {
      ...globalStyles.defaultFont,
      backgroundColor: 'transparent',
      borderBottomWidth: 1,
      borderBottomColor: 'grey',
      padding: 10,
      marginBottom: 20,
    },
    datePicker: {
        width: '100%',
        marginVertical: 10,
        backgroundColor: 'rgba(0,0,0,0.8)', 
      },
      
      checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
      },
      
      checkboxLabel: {
        marginLeft: 8,
      },
    buttonGroup: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
    },
    button: {
      backgroundColor: '#24A6E4',
      padding: 15,
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    buttonText: {
      fontSize: 18,
      textAlign: 'center',
      color: 'white',
      fontWeight: 'bold',
    },
    cancelButton: {
      borderWidth: 3,
      borderColor: 'rgba(24,171,234,0.8)',
      padding: 15,
      borderRadius: 20,
      marginHorizontal: 15,
    },
    confirmButton: {
      backgroundColor: 'rgba(24,171,234,0.8)',
      padding: 15,
      borderRadius: 20,
      marginHorizontal: 15,
    },
    input: {
      ...globalStyles.defaultFont,
      backgroundColor: 'transparent',
      borderBottomWidth: 1,
      borderBottomColor: 'grey',
      padding: 10,
      marginBottom: 20,
    },
    inputActive: {
      borderBottomColor: '#24A6E4', // Un color más claro o diferente para el estado activo
    },
    
    errorInput: {
      borderColor: 'red',
      borderWidth: 1,
      // Otros estilos específicos para indicar error
    },
    errorText: {
      fontSize: 14,
      color: 'red',
      marginBottom: 10,
    },    
    // Añade estilos adicionales según sea necesario
  });
  