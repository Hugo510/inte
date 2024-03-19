import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Platform, StatusBar, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { BarChart } from 'react-native-chart-kit'; // Importar BarChart de react-native-chart-kit
import styles from './graphicsScreen.styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get("window").width; // Obtener el ancho de la pantalla para el gráfico

const categories = ['ALL', 'GAS', 'ULTRASONICO', 'TEMPERATURA', 'HUMEDAD'];

const GraphicScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [graphData, setGraphData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDataForSensor = async (sensorType = 'ALL') => {
      setIsLoading(true);
      setError('');
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        if (!userToken) {
          throw new Error('User token not available');
        }
        const headers = { Authorization: `Bearer ${userToken}` };

        const endpoint = `http://${global.ipDireccion}:3000/api/devices/byAdmin`;
        const adminDevicesResponse = await fetch(endpoint, {
          method: 'GET',
          headers,
        });

        const adminDevicesData = await adminDevicesResponse.json();
        if (!adminDevicesResponse.ok) {
          throw new Error(adminDevicesData.message || 'Failed to fetch devices');
        }

        if (adminDevicesData && adminDevicesData.length > 0) {
          const deviceId = adminDevicesData[0]._id;

          let mappedSensorType = '';
          switch(sensorType.toUpperCase()) {
            case 'GAS': mappedSensorType = 'gasDetector'; break;
            case 'ULTRASONICO': mappedSensorType = 'ultrasonic'; break;
            case 'TEMPERATURA': mappedSensorType = 'temperature'; break;
            case 'HUMEDAD': mappedSensorType = 'humidity'; break;
            default: throw new Error('Tipo de sensor no reconocido: ' + sensorType);
          }

          const endpoint2 = `http://${global.ipDireccion}:3000/api/devices/${deviceId}/sensors/${mappedSensorType}/data`;
          const sensorDataResponse = await fetch(endpoint2, { method: 'GET', headers });
          const sensorData = await sensorDataResponse.json();

          //console.log(`Data for ${mappedSensorType}: ${sensorData}`)

          if (!sensorDataResponse.ok) {
            throw new Error(sensorData.message || `Failed to fetch data for sensor: ${sensorType}`);            
          }

          if (sensorData && sensorData.length > 0) {
            console.log(sensorData)
            setGraphData(prevData => ({
              ...prevData,
              [sensorType]: sensorData
            }));
          } else {
            throw new Error(`No data found for sensor: ${sensorType}`);
          }
        } else {
          throw new Error('No devices found for this admin');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    
    if (selectedCategory === 'ALL') {
      global.categories.forEach(category => {
        fetchDataForSensor(category);
      });
    } else {
      fetchDataForSensor(selectedCategory);
    }
  }, [selectedCategory]);

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
      };
     
      const getChartData = (sensorData, sensorType) => {
        // Crear un arreglo de valores basado en el tipo de sensor
        let values;
        switch(sensorType) {
          case 'GAS':
            values = sensorData.map(item => item.value);
            break;
          case 'ULTRASONICO':
            values = sensorData.map(item => item.distance);
            break;
          case 'TEMPERATURA':
            values = sensorData.map(item => item.temperature);
            break;
            case 'HUMEDAD':
            values = sensorData.map(item => item.temperature);
            break;
          default:
            values = [];
        }
        return {
          labels: sensorData ? sensorData.map(item => new Date(item.timestamp).toLocaleTimeString()) : [],
          datasets: [{
            data: values,
          }],
          legend: ["Sensor Data"] // Esto es opcional
        };
      };
      
      const chartConfig = {
        backgroundGradientFrom: "#fff",
        backgroundGradientTo: "#fff",
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Color del texto
        strokeWidth: 2, // Ancho de la línea de la barra
        barPercentage: 0.5,
        useShadowColorFromDataset: false, // Desactiva la sombra de color del dataset
        // Rotar las etiquetas del eje X
        propsForLabels: {
          rotation: '45', // Rota las etiquetas en 45 grados
          fontSize: "12", // Puedes ajustar el tamaño de la fuente si es necesario
        },
        // Limitar el número de etiquetas (esto puede requerir lógica adicional fuera de chartConfig)
        formatXLabel: (label, index, labels) => {
          // Solo muestra una etiqueta cada n puntos de datos
          const interval = 5; // por ejemplo, muestra cada 5ta etiqueta
          return index % interval === 0 ? label : '';
        },
        // Tooltip interactivo (esto puede requerir un componente adicional o una lógica de manejo de eventos)
        // Verifica la documentación de react-native-chart-kit para soporte de tooltips
        // Zoom y Desplazamiento no son propiedades de configuración soportadas directamente
        // por react-native-chart-kit, esto puede requerir una solución alternativa o
        // el uso de una biblioteca de gráficos diferente.
        // Para Diseño Responsivo, asegúrate de que el componente de gráfico se renderice dentro de una vista
        // que se adapte a diferentes tamaños de pantalla. Puedes necesitar usar consultas de medios o 
        // dimensiones en react-native para ajustar el tamaño del gráfico de forma dinámica.
      };
      
      

    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Gráficas de Sensores</Text>
          <Icon name="search" size={24} color="#000" onPress={() => {/* lógica de búsqueda */}} />
        </View>
  
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonSelected
              ]}
              onPress={() => handleCategorySelect(category)}
            >
              <Text style={styles.categoryButtonText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
  
        {isLoading ? (
  <ActivityIndicator size="large" color="#0000ff" />
) : (
  <ScrollView>
    {selectedCategory === 'ALL' ? (
      categories.filter(category => category !== 'ALL').map((category) => (
        graphData[category] ? (
          <View key={category} style={styles.chartContainer}>
            <Text style={{ textAlign: 'center' }}>{category}</Text>
            <BarChart
              data={getChartData(graphData[category], category)} // Asegúrate de pasar category aquí
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              fromZero={true}
            />
          </View>
        ) : null
      ))
    ) : (
      graphData[selectedCategory] && (
        <View style={styles.chartContainer}>
          <BarChart
            data={getChartData(graphData[selectedCategory], selectedCategory)} // Asegúrate de pasar selectedCategory aquí
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            fromZero={true}
          />
        </View>
      )
    )}
  </ScrollView>
)}

      </SafeAreaView>
    );
  };

/* const OfferCard = ({ type, value, alertType }) => {
  return(
    <Text style={styles.categoryButtonText}>{category}</Text>
  );
}; */

export default GraphicScreen;
