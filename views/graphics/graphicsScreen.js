import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Platform, StatusBar, ScrollView , Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Client } from 'paho-mqtt';
import { LineChart } from 'react-native-chart-kit';
import styles from '../cards/cardsScreen.styles';



const categories = ['ALL', 'HUMO', 'INFRAROJO', 'TEMPERATURA', 'CAMARA', 'HUMEDAD'];

const GraphicScreen = ({ navigation }) => {
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [graphData, setGraphData] = useState({});
  
  
  
    useEffect(() => {


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
        },
      };
  
      client.onConnectionLost = (responseObject) => {
        if (responseObject.errorCode !== 0) {
          console.log('onConnectionLost:' + responseObject.errorMessage);
        }
      };
  
      client.onMessageArrived = (message) => {
        console.log('Mensaje recibido:', message.payloadString);
      
        try {
          const topicParts = message.destinationName.split('/');
          const category = topicParts[2].toUpperCase();
      
          const value = parseFloat(message.payloadString); // Asegurándose de que sea un número
      
          setGraphData(prevGraphData => {
            const updatedGraphData = { ...prevGraphData };
            if (!updatedGraphData[category]) updatedGraphData[category] = [];
            updatedGraphData[category].push(value);
            
            console.log(`Datos actualizados para ${category}:`, updatedGraphData[category]);
            return updatedGraphData;
          });      
      
        } catch (error) {
          console.error('Error al procesar el mensaje MQTT:', error);
        }
      };
      
  
      client.connect(options);
      console.log('graphData ha cambiado:', graphData);
  
      return () => client.disconnect();
    }, [graphData]);

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
      };

  return (
    <SafeAreaView style={[styles.safeArea, { marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight }]}>
        <Header navigation={navigation} />
            <CategoriesMenu categories={categories} selectedCategory={selectedCategory} onSelectCategory={handleCategorySelect} />
            {categories.includes(selectedCategory) && <RenderChart category={selectedCategory} graphData={graphData} />}

    </SafeAreaView>

        

  );
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

const RenderChart = ({ category, graphData }) => {
    const categoryData = graphData[category] || [];
    if (categoryData.length === 0) {
        return <Text>No hay datos disponibles para esta categoría.</Text>;
    }

    const labels = categoryData.map((_, index) => `Punto ${index + 1}`);
    const data = {
        labels,
        datasets: [{
            data: categoryData,
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // Ajusta según tus necesidades
            strokeWidth: 2
        }]
    };

    return (
        <LineChart
            data={data}
            width={Dimensions.get('window').width} // from react-native
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
                backgroundColor: "#e26a00",
                backgroundGradientFrom: "#fb8c00",
                backgroundGradientTo: "#ffa726",
                decimalPlaces: 2, // opcional, número de decimales en los labels del eje Y
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                    borderRadius: 16
                },
                propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: "#ffa726"
                }
            }}
            bezier // Propiedad para suavizar la línea del gráfico
            style={{
                marginVertical: 8,
                borderRadius: 16
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
