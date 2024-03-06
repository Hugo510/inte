import { StyleSheet, Dimensions } from 'react-native';
import { StatusBar } from 'react-native';


// Obtén las dimensiones de la pantalla
const { width, height } = Dimensions.get('window');


export default StyleSheet.create({ 
    safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  categoriesContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
  },
  categoryButton: {
    marginHorizontal: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  categoryButtonSelected: {
    backgroundColor: '#007bff',
  },
  categoryButtonText: {
    color: '#007bff',
    fontSize: 16,
  },
  chartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartStyle: {
    width: Dimensions.get('window').width - 20,
    height: 300,
  },
});