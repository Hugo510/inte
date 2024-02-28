import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, Platform, StatusBar, ScrollView  } from 'react-native';
import { Card } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './cardsScreen.styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import axios from 'axios';
import firebase from '../../firebaseConfig'; // Asegúrate de que esta configuración esté correcta


const categories = ['ALL', 'GAS', 'ULTRASONICO', 'TEMPERATURA'];

const CardsScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false); // Añadido estado isLoading
  
  useEffect(() => {

    const loadCardsFromDatabase = async () => {
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
            const response  = await axios.get(`http://${global.ipDireccion}:3000/api/devices/devices/${deviceId}/dataCards`, { headers });
            //setMessages(alerts);

            if (response.data) {
              setMessages(response.data);
    
              // Lanzar notificaciones para cada alerta cargada
              response.data.forEach(alert => {
                Notifications.scheduleNotificationAsync({
                  content: {
                    title: "Nueva Alerta",
                    body: `Tienes una nueva alerta: ${alert.alertType}`,
                    data: { alert },
                  },
                  trigger: null,
                });
              });
            }

          }
        } catch (error) {
          console.error('Error al inicializar datos:', error);
        } finally {
          setIsLoading(false); // Finaliza la carga independientemente del resultado
        }
      };
  
    loadCardsFromDatabase();
  }, []);
  

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
      };
      
    

      
      const filteredMessages = selectedCategory === 'ALL' 
    ? messages 
    : messages.filter(message => message.category === selectedCategory);

    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    return (
      <SafeAreaView style={[globalStyles.safeArea, { marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight }]}>
        <Header navigation={navigation} />
        <CategoriesMenu categories={categories} selectedCategory={selectedCategory} onSelectCategory={handleCategorySelect} />
        <FlatList
          data={filteredMessages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <OfferCard {...item} />}
        />
        <BottomNavBar />
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
  


  // Mejoras en CategoriesMenu para mejorar la legibilidad y la experiencia de usuario
const CategoriesMenu = ({ categories, selectedCategory, onSelectCategory }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.categoriesContainer}
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

const getAlertStyles = (alertType) => {
  switch (alertType) {
      case "WARNING":
          return { backgroundColor: 'orange', icon: 'exclamation-triangle' };
      case "INFO":
          return { backgroundColor: 'blue', icon: 'info-circle' };
      case "ALERT":
          return { backgroundColor: 'red', icon: 'times-circle' };
      default:
          return { backgroundColor: 'green', icon: 'circle' };
  }
};

const OfferCard = ({ type, value, alertType }) => {
  const { backgroundColor, icon } = getAlertStyles(alertType);

  return (
      <Card containerStyle={[styles.cardContainer, { backgroundColor }]}>
          <Icon name={icon} size={50} color="#fff" />
          <Text style={styles.cardType}>{type}</Text>
          <Text style={styles.cardValue}>{value}</Text>
      </Card>
  );
};


const copyToClipboard = (code) => {
    // Utilizaría el Clipboard API de React Native o algún paquete externo
    console.log(`Código ${code} copiado al portapapeles`);
  };

const BottomNavBar = () => (
  <View style={styles.bottomNavContainer}>
    {/* Íconos de navegación */}
  </View>
);

export default CardsScreen;



/* /hugo/humo/max
{
  advertencia
}
 */