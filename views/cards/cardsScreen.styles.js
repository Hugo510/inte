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
      borderRadius: 8, // Esquinas redondeadas para las tarjetas
      padding: basePadding,
      marginVertical: 8,
      marginHorizontal: 16,
      shadowOpacity: 0.1, // Sombra para las tarjetas
      shadowRadius: 5,
      shadowOffset: { width: 0, height: 2 },
      elevation: 3, // Elevación para Android
    },
    bottomNavContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: '#6200EE', // Igual que la barra superior para coherencia
      paddingVertical: basePadding / 2,
    },
    // Continúa con los estilos específicos para otros componentes según sea necesario
  });
