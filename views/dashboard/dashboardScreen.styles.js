import { StyleSheet, Dimensions } from 'react-native';
import { StatusBar } from 'react-native';


// Obtén las dimensiones de la pantalla
const { width, height } = Dimensions.get('window');


export default StyleSheet.create({
    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: '#f5f5f5',
      },
      scrollView: {
        marginHorizontal: 20,
        flex: 1, // El ScrollView debe expandirse para llenar el espacio disponible
      },
      scrollViewContent: {
        flexGrow: 1, // Asegúrate de que el contenido crezca para ocupar el espacio
        justifyContent: 'space-between', // Esto distribuirá el contenido uniformemente
      },
      container: {
        padding: 20,
        justifyContent: 'center', // Centra los sliders verticalmente en la pantalla
      },
    
      contentContainer: {
        padding: 20,
        paddingBottom: 50, // Espacio adicional para el desplazamiento
      },
      tabMenuContainer: {
        backgroundColor: '#333', // Color de fondo del menú de pestañas
        paddingVertical: 10,
      },
      tabButton: {
        marginRight: 10,
        padding: 10,
        borderRadius: 20,
        backgroundColor: '#555', // Color de fondo del botón de pestaña no seleccionado
      },
      tabButtonSelected: {
        backgroundColor: 'rgba(255,255,255,0.8)', // Color de fondo del botón de pestaña seleccionado
      },
      tabButtonText: {
        color: '#fff', // Color del texto del botón de pestaña
      },
    
      sliderRow: {
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
      },
      sliderContainer: {
        alignItems: 'stretch', // Asegurarse de que los sliders ocupen todo el ancho disponible
        marginVertical: 10,
      },
      slider: {
        width: width - 40, // Ajuste dinámico basado en el ancho de la pantalla
        alignSelf: 'center',
        height: 40,
    margin: 10,
      },
      text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
      },
      minMaxText: {
        fontSize: 16,
        color: '#888',
        alignSelf: 'center',
      },
      sendButton: {
        backgroundColor: '#007bff', // Un color que destaque
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    sendButtonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    });