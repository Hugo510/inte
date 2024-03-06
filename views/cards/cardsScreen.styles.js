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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // Añadir padding para Android
},
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: basePadding,
    height: headerHeight,
    backgroundColor: '#fff',
    borderBottomColor: '#dedede',
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: fontSizeResponsive, // Usa una escala basada en el ancho de la pantalla
    fontWeight: 'bold',
    color: '#000',
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flex: 1, // Ocupa el espacio restante después de CategoriesMenu
    // Puedes agregar más estilos según sea necesario
},
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 10,
    backgroundColor: '#f8f8f8',
    alignItems: 'center', // Ejemplo de estilo
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  categoryButtonSelected: {
    borderBottomWidth: 3,
    borderBottomColor: '#000', // Color for the selected tab indicator
  },
  categoryButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardDiscount: {
    fontSize: fontSizeResponsive * 1.2, // Usa una escala basada en el tamaño base
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  cardConditions: {
    fontSize: fontSizeResponsive * 0.7, // Más pequeño que el título
    color: '#757575',
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopColor: '#dedede',
    borderTopWidth: 1,
    paddingTop: basePadding / 2,
  },
  copyButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: basePadding,
    paddingVertical: basePadding / 3,
    borderRadius: basePadding / 4,
  },
  bottomNavContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderTopColor: '#dedede',
    borderTopWidth: 1,
    paddingVertical: basePadding / 2,
  },
  categoryButton: {
    padding: basePadding / 2,
  },
  categoryButtonText: {
    color: '#000',
    fontSize: fontSizeResponsive, // Igual que el título
  },
});
