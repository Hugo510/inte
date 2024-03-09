import { StyleSheet, Dimensions } from 'react-native';
import { StatusBar } from 'react-native';

const { width, height } = Dimensions.get('window');

// Define algunos tamaños base que puedes ajustar según tus necesidades
const basePadding = width * 0.04;
const headerHeight = height * 0.07;
const fontSizeResponsive = width * 0.045; // Aproximadamente 20 para width de 360

export default StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#F5F5F5', // Un fondo claro para la aplicación
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: basePadding,
      backgroundColor: '#6200EE', // Un color distintivo para la barra superior
      borderBottomColor: '#DDD',
      borderBottomWidth: 1,
    },
    headerTitle: {
      fontSize: fontSizeResponsive * 1.2,
      fontWeight: 'bold',
      color: '#FFFFFF', // Texto blanco para contraste
    },
    categoriesContainer: {
      flexDirection: 'row',
      paddingVertical: 10,
      backgroundColor: '#EEEEEE', // Un suave color de fondo para las categorías
      alignItems: 'center',
    },
    categoryButton: {
      padding: basePadding / 2,
      marginHorizontal: 5, // Añade un poco de espacio entre los botones
      backgroundColor: '#FFF', // Fondo claro para botones de categoría
      borderRadius: 20, // Esquinas redondeadas para un aspecto moderno
      shadowOpacity: 0.2, // Sombra suave para resaltar los botones
      shadowRadius: 3,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2, // Elevación para Android
    },
    categoryButtonSelected: {
      backgroundColor: '#6200EE', // Resaltar la categoría seleccionada
      borderBottomWidth: 0, // Eliminar borde inferior para categoría seleccionada
    },
    categoryButtonText: {
      color: '#000',
      fontSize: fontSizeResponsive,
      fontWeight: 'bold',
    },
    cardContainer: {
      borderRadius: 10, // Esquinas más redondeadas para un look moderno
      padding: 15, // Aumentar el padding para más espacio alrededor del contenido
      marginVertical: 10,
      marginHorizontal: 12,
      shadowOpacity: 0.2, // Sombra más pronunciada para profundidad
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 4 },
      elevation: 5, // Elevación para Android
      backgroundColor: '#FFFFFF', // Fondo blanco para contraste con el texto y los iconos
    },
    
    cardTitle: {
      fontSize: 18, // Hacer el título más grande para destacar
      fontWeight: 'bold',
      color: '#333333', // Color oscuro para mayor contraste
      marginBottom: 5,
    },
    
    cardValue: {
      fontSize: 16,
      color: '#666666', // Color más suave para el cuerpo del texto
      marginBottom: 10, // Más espacio antes del timestamp
    },
    
    cardTimestamp: {
      fontSize: 14,
      color: '#999999', // Color suave para el timestamp, indica información secundaria
      marginBottom: 10, // Espacio antes del botón de acción, si aplica
    },
    
    actionButton: {
      backgroundColor: '#6200EE', // Usar el color principal para acciones
      paddingVertical: 8,
      paddingHorizontal: 20,
      borderRadius: 20, // Botones con bordes redondeados
      alignSelf: 'flex-start', // Alinear el botón al inicio
      marginTop: 10, // Espacio desde el texto anterior
    },
    
    actionButtonText: {
      color: '#FFFFFF', // Texto blanco para contraste
      fontSize: 16, // Tamaño claro y legible para acciones
      fontWeight: 'bold',
    },
    
    bottomNavContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: '#6200EE', // Igual que la barra superior para coherencia
      paddingVertical: basePadding / 2,
    },
    // Continúa con los estilos específicos para otros componentes según sea necesario
  });
