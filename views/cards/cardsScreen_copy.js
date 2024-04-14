import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, Platform, StatusBar, ScrollView, ActivityIndicator } from 'react-native';
import { Card } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './cardsScreen.styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import CustomHeader from '../../components/recycle/components/header';
import CategoryScroll from '../../components/recycle/components/categoryScroll';
import DeviceSelector from '../../components/deviceList/DeviceSelector';
import { IconButton } from 'react-native-paper';


const categories = ['ALL', 'GAS', 'ULTRASONICO', 'TEMPERATURA', 'HUMEDAD'];

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

  const sensorTypeMapping = {
    'ALL': ['gasDetector', 'ultrasonic', 'temperature'],
    'GAS': 'gasDetector',
    'ULTRASONICO': 'ultrasonic',
    'TEMPERATURA': 'temperature',
    'HUMEDAD': 'humidity',
  };

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

        const deviceResponse = await axios.get(`http://${global.ipDireccion}:3000/api/devices/byAdmin`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });

        if (deviceResponse.data.length === 0) {
          throw new Error('No devices found for this user');
        }

        const deviceId = deviceResponse.data[0]._id; // Asumiendo que el usuario tiene al menos un dispositivo
        const mappedSensorTypes = selectedCategory === 'ALL' ? sensorTypeMapping['ALL'] : [sensorTypeMapping[selectedCategory]]; // Asegúrate de que esto sea un array


        let allAlerts = [];
        for (const sensorType of mappedSensorTypes) {
          console.log(sensorType)
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

  const filteredMessages = messages; // Si ya están correctamente filtrados, esto podría ser todo lo que necesitas



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
  


  const CategoriesMenu = ({ categories, selectedCategory, onSelectCategory }) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContainer}>
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            styles.categoryButton,
            selectedCategory === category && styles.categoryButtonSelected,
          ]}
          onPress={() => onSelectCategory(category)}
        >
          <Text style={[
            styles.categoryButtonText,
            selectedCategory === category && styles.categoryButtonTextSelected,
          ]}>
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
  

  const getAlertStyles = (alertType) => {
    switch (alertType) {
      case "Advertencia":
        return { backgroundColor: 'orange', icon: 'exclamation-triangle', textColor: '#000', buttonText: 'Detalles' };
      case "Error":
        return { backgroundColor: 'blue', icon: 'info-circle', textColor: '#fff', buttonText: 'Más Info' };
      case "Alerta":
        return { backgroundColor: 'red', icon: 'times-circle', textColor: '#fff', buttonText: 'Resolver' };
      default:
        // Un estilo por defecto para tipos de alerta no esperados
        return { backgroundColor: 'grey', icon: 'question-circle', textColor: '#fff', buttonText: '' };
    }
  };
  

  const OfferCard = ({ id, category, alertType, value, timestamp }) => {
    const { backgroundColor, icon, textColor, buttonText } = getAlertStyles(alertType);
    const formattedTimestamp = new Date(timestamp).toLocaleString();
  
    const humanReadableCategory = {
      gasdetector: 'GAS',
      ultrasonic: 'ULTRASONICO',
      temperature: 'TEMPERATURA',
    }[category.toLowerCase()] || 'Desconocido';
  
    return (
      <Card containerStyle={[styles.cardContainer, { backgroundColor }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name={icon} size={30} color={textColor} />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.cardTitle}>{humanReadableCategory}</Text>
            <Text style={styles.cardValue}>{value}</Text>
            <Text style={styles.cardTimestamp}>{formattedTimestamp}</Text>
          </View>
        </View>
        {buttonText && (
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>{buttonText}</Text>
          </TouchableOpacity>
        )}
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