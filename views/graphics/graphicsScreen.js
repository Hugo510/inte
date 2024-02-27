import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Platform, StatusBar, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Client } from 'paho-mqtt';
import HighchartsReactNative from '@highcharts/highcharts-react-native';
import styles from './graphicsScreen.styles';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const categories = ['ALL', 'HUMO', 'INFRAROJO', 'TEMPERATURA', 'CAMARA', 'HUMEDAD'];

const GraphicScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [graphData, setGraphData] = useState({});
  const [isLoading, setIsLoading] = useState(true); // Nuevo estado para controlar la carga
  
    useEffect(() => {

      const fetchData = async () => {
        setIsLoading(true); // Comienza a cargar
        try {
          const userToken = await AsyncStorage.getItem('userToken');
          const userId = await AsyncStorage.getItem('userId');
          const headers = { Authorization: `Bearer ${userToken}` };
  
          // Obtener dispositivos por administrador
          const adminDevicesResponse = await axios.get(`http://${global.ipDireccion}:3000/api/devices/byAdmin`, { headers });
          if (adminDevicesResponse.data && adminDevicesResponse.data.length > 0) {
            // Asume que usamos el primer dispositivo por simplicidad, ajusta según tu lógica de negocio
            const deviceId = adminDevicesResponse.data[0]._id;
            
            // Carga los mensajes de la pantalla gráfica para el dispositivo obtenido
            const graphicScreenMessagesResponse = await axios.get(`http://${global.ipDireccion}:3000/api/devices/devices/${deviceId}/graphicScreenMessage`, { headers });
            setGraphData(graphicScreenMessagesResponse.data);
          }
        } catch (error) {
          console.error('Error al inicializar datos:', error);
        } finally {
          setIsLoading(false); // Finaliza la carga independientemente del resultado
        }
      };
      fetchData();

      const clientId = 'clientId_' + Math.random().toString(16).slice(2, 8);
      const client = new Client('broker.hivemq.com', 8000, clientId);
  
      const topics = categories.flatMap(category => [
        `/hugo/${category.toLowerCase()}`,
      ]);
      
      const options = {
        useSSL: false,
        onSuccess: () => {
          console.log('Conectado a MQTT');
          topics.forEach(topic => client.subscribe(topic));
      },
        onFailure: (error) => {
          console.log('Conexión fallida:', error);
          setIsLoading(false); // También desactiva el indicador de carga en caso de fallo
        },
      };
  
      client.onConnectionLost = (responseObject) => {
        if (responseObject.errorCode !== 0) {
          console.log('onConnectionLost:' + responseObject.errorMessage);
          setIsLoading(true); // Reactiva el indicador de carga si se pierde la conexión
        }
      };
  
      client.onMessageArrived = (message) => {
        console.log('Mensaje recibido:', message.payloadString);
        setIsLoading(false); // Desactiva el indicador de carga al recibir un mensaje

      
       
      try {
        if (!categories.includes(category) && category !== 'ALL') {
          throw new Error(`Categoría desconocida: ${category}`);
        }

        const messageData = JSON.parse(message.payloadString);
        console.log('Mensaje recibido:', message.payloadString);
        setIsLoading(false);

        // Aquí podrías incluir la lógica para subir el dato recibido a tu base de datos
        axios.post(`http://${global.ipDireccion}:3000/api/devices/devices/${deviceId}/graphicScreenMessage`, messageData);

        setGraphData(prevGraphData => {
          const updatedGraphData = { ...prevGraphData };
          if (!updatedGraphData[category]) updatedGraphData[category] = [];
          updatedGraphData[category].push(messageData.value);
          
          return updatedGraphData;
        });

      } catch (error) {
        console.error('Error al procesar el mensaje MQTT:', error);
      }
    };
      
      
  
      client.connect(options);
      console.log('graphData ha cambiado:', graphData);
  
      return () => client.disconnect();
    }, [/* graphData */]);

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
      };

      const generateChartOptions = (data) => {
        return {
          chart: {
            type: 'line'
          },
          title: {
            text: `Datos de ${selectedCategory}`
          },
          series: Object.keys(data).map(category => ({
            name: category,
            data: data[category].map(item => item.value),
            color: `#${Math.floor(Math.random()*16777215).toString(16)}` // Genera un color aleatorio
          }))
        };
      };

      const Header = ({ navigation }) => (
        <View style={styles.headerContainer}>
          <Icon name="arrow-left" size={24} color="#000" onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>OFFERS</Text>
          <Icon name="search" size={24} color="#000" onPress={() => {/* lógica de búsqueda */}} />
        </View>
      );
      
    
    
      const CategoriesMenu = ({ categories, selectedCategory, onSelectCategory }) => {
        return (
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesContainer} // Estilos de layout aquí
            >
                {categories.map((category) => (
                    <TouchableOpacity
                        key={category}
                        style={[
                            styles.categoryButton,
                            selectedCategory === category && styles.categoryButtonSelected,
                        ]}
                        onPress={() => onSelectCategory(category)}
                    >
                        <Text style={styles.categoryButtonText}>{category}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        );
    };
    

      return (
        <SafeAreaView style={[styles.safeArea, { marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight }]}>
          <Header navigation={navigation} />
          <CategoriesMenu categories={categories} selectedCategory={selectedCategory} onSelectCategory={handleCategorySelect} />
          {isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <ScrollView style={styles.container}>
              {selectedCategory === 'ALL' ? (
                // Renderiza todos los gráficos para "ALL"
                Object.keys(graphData).length > 0 ? (
                  <HighchartsReactNative
                    styles={{ height: "100%", width: "100%" }}
                    options={generateChartOptions(graphData)}
                  />
                ) : (
                  <Text>No hay datos disponibles.</Text>
                )
              ) : (
                // Renderiza el gráfico para la categoría seleccionada
                graphData[selectedCategory] ? (
                  <HighchartsReactNative
                    styles={{ height: "100%", width: "100%" }}
                    options={generateChartOptions({ [selectedCategory]: graphData[selectedCategory] })}
                  />
                ) : (
                  <Text>No hay datos disponibles para {selectedCategory}.</Text>
                )
              )}
            </ScrollView>
          )}
        </SafeAreaView>
      );
    };
  
const RenderCharts = ({ category, graphData }) => {
  // Cuando la categoría es "ALL", renderizamos gráficos para todas las categorías disponibles en graphData
  if (category === 'ALL') {
    const categories = Object.keys(graphData);
    if (categories.length === 0) {
      return <Text>No hay datos disponibles.</Text>;
    }

    return (
      <ScrollView>
        {categories.map((categoryKey) => (
          <View key={categoryKey}>
            <Text style={styles.chartTitle}>{categoryKey}</Text>
            <RenderSingleChart
              category={categoryKey}
              data={graphData[categoryKey]}
            />
          </View>
        ))}
      </ScrollView>
    );
  } else {
    // Para una categoría específica, solo mostramos el gráfico correspondiente
    return <RenderSingleChart category={category} data={graphData[category] || []} />;
  }
};

const RenderSingleChart = ({ category, data }) => {
  if (data.length === 0) {
    return <Text>No hay datos disponibles para {category}.</Text>;
  }

  const labels = data.map((_, index) => `${index + 1}`);
  const chartData = {
    labels,
    datasets: [{
      data,
      color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
      strokeWidth: 2,
    }],
  };

  return (
    <LineChart
      data={chartData}
      width={Dimensions.get('window').width}
      height={220}
      yAxisLabel=""
      yAxisSuffix=""
      chartConfig={{
        backgroundColor: "#e26a00",
        backgroundGradientFrom: "#fb8c00",
        backgroundGradientTo: "#ffa726",
        decimalPlaces: 2,
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: {
          borderRadius: 16,
        },
        propsForDots: {
          r: "6",
          strokeWidth: "2",
          stroke: "#ffa726",
        },
      }}
      bezier
      style={{
        marginVertical: 8,
        borderRadius: 16,
      }}
    />
  );
};


  
/* const OfferCard = ({ type, value, alertType }) => {
  return(
    <Text style={styles.categoryButtonText}>{category}</Text>
  );
}; */

export default GraphicScreen;
