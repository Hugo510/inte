import { StyleSheet, Dimensions } from 'react-native';
import { StatusBar } from 'react-native';


// Obtén las dimensiones de la pantalla
const { width, height } = Dimensions.get('window');


export default StyleSheet.create({ 
    container: {
        flex: 1,
        padding: width * 0.05, // Usa un porcentaje del ancho de la pantalla para el padding
      },
      chart: {
        width: width * 0.9, // Ajusta el ancho del gráfico al 90% del ancho de la pantalla
        height: height * 0.3, // Ajusta la altura del gráfico al 30% de la altura de la pantalla
      },
    

});