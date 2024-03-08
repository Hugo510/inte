import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, Platform, StatusBar, ScrollView, ActivityIndicator } from 'react-native';
import { Card } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './cardsScreen.styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const categories = ['ALL', 'GAS', 'ULTRASONICO', 'TEMPERATURA'];

/* async function registerForPushNotificationsAsync() {
  let token;
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }
  token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log(token);

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
} */


const CardsScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSensorAlerts = async () => {
      setIsLoading(true);
      setError('');

      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const userId = await AsyncStorage.getItem('userId');
        if (!userToken || !userId) {
          throw new Error('User token or user ID not available');
        }

        const deviceResponse = await axios.get(`http://${global.ipDireccion}:3000/api/devices/byUser/${userId}`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });

        if (deviceResponse.data.length === 0) {
          throw new Error('No devices found for this user');
        }

        const deviceId = deviceResponse.data[0]._id; // Asumiendo que el usuario tiene al menos un dispositivo
        const sensorTypes = selectedCategory === 'ALL' ? ['gasDetector', 'ultrasonic', 'temperature'] : [selectedCategory];

        let allAlerts = [];
        for (const sensorType of sensorTypes) {
          const alertsResponse = await axios.get(`http://${global.ipDireccion}:3000/api/devices/${deviceId}/sensors/${sensorType}/alerts`, {
            headers: { Authorization: `Bearer ${userToken}` },
          });

          const sensorAlerts = alertsResponse.data.map(alert => ({
            ...alert,
            id: alert._id,
            category: sensorType.toUpperCase(),
            alertType: alert.messageType,
            value: alert.message,
          }));

          allAlerts = [...allAlerts, ...sensorAlerts];
        }

        setMessages(allAlerts);
      } catch (error) {
        console.error('Error fetching sensor alerts:', error);
        setError(error.message || 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    loadSensorAlerts();
  }, [selectedCategory]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const filteredMessages = messages.filter(message => selectedCategory === 'ALL' || message.category === selectedCategory);


  return (
    <SafeAreaView style={[styles.safeArea, { marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight }]}>
      <Header navigation={navigation} />
      <CategoriesMenu categories={categories} selectedCategory={selectedCategory} onSelectCategory={handleCategorySelect} />
      <FlatList
        data={filteredMessages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <OfferCard {...item} />}
      />
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