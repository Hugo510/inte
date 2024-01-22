// styles/SignUpScreenStyles.js
import { StyleSheet, Dimensions } from 'react-native';
import { globalStyles } from '../../styles/globalStyles'; // Asegúrate de que la ruta es correcta


const { width, height } = Dimensions.get('window');


// styles/SignUpScreenStyles.js
export default StyleSheet.create({
    container: {
      flex: 1,
      
    },
    imageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 80,
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
      backgroundColor: 'teal',
      padding: 10,
      borderRadius: 5,
      width: '48%',
    },
    buttonText: {
      textAlign: 'center',
      color: 'white',
      fontWeight: 'bold',
    },
    // Añade estilos adicionales según sea necesario
  });
  