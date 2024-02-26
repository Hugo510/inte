import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, Platform, StatusBar, ScrollView  } from 'react-native';
import { Card } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './cardsScreen.styles';
import { Client } from 'paho-mqtt';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';


const categories = ['ALL', 'HUMO', 'INFRAROJO', 'TEMPERATURA', 'CAMARA', 'HUMEDAD'];

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
  const [messages, setMessages] = useState([]); // Estado para un único mensaje
  const [selectedCategory, setSelectedCategory] = useState('ALL'); // Estado para la categoría seleccionada

  
    useEffect(() => {

      const loadCards = async () => {
        try {
          const jsonValue = await AsyncStorage.getItem('@storage_Cards');
          if (jsonValue != null) {
            setMessages(JSON.parse(jsonValue));
          }
        } catch (e) {
          console.log('Error al cargar las tarjetas:', e);
        }
      };
  
      loadCards();
      //registerForPushNotificationsAsync();
    

      const clientId = 'clientId_' + Math.random().toString(16).slice(2, 8);
      const client = new Client('broker.hivemq.com', 8000, clientId);
  
      const topics = categories.flatMap(category => [
        `/hugo/${category.toLowerCase()}/max`,
        `/hugo/${category.toLowerCase()}/min`
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
          const type = topicParts[3]; // 'max' o 'min'
      
          // Determinar el tipo de alerta basado en el contenido del mensaje
          let alertType;
          if (message.payloadString.includes("advertencia")) {
            alertType = "WARNING";
          } else if (message.payloadString.includes("información")) {
            alertType = "INFO";
          }
          else if (message.payloadString.includes("alerta")){
            alertType = "ALERT";
          } else {
            alertType = "NON";
          }
      
          const newMessage = {
            category,
            type,
            value: message.payloadString,
            alertType, // Agregar el nuevo campo
            id: generateUniqueId()
          };
          
          handleNewMessage(newMessage); // Aquí se llama a la función
          //setMessages(prevMessages => [...prevMessages, newMessage]);
          
          
      
        } catch (error) {
          console.error('Error al procesar el mensaje MQTT:', error);
        }
      };
      
      
      
      // Función para generar un ID único (puede ser tan simple o complejo como necesites)
      function generateUniqueId() {
        return Math.random().toString(36).slice(2, 9);
      }

      const handleNewMessage = (newMessage) => {
            // Suponiendo que esta función se llama cada vez que llega un nuevo mensaje
            setMessages(prevMessages => [...prevMessages, newMessage]);
          
            // Lanza una notificación local para el nuevo mensaje
            Notifications.scheduleNotificationAsync({
              content: {
                title: alertType, // "ALERT", "WARNING", etc.
                body: `Tienes una nueva notificacion en la categoría de ${category}.`,
                data: { data: 'goes here' },
              },
              trigger: null, // Esto enviará la notificación de inmediato
            });
          };
  
      client.connect(options);
  
      return () => client.disconnect();
    }, []);

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
      };
    
      const filteredMessages = selectedCategory === 'ALL' 
    ? messages 
    : messages.filter(message => message.category === selectedCategory);

  return (
    <SafeAreaView style={[styles.safeArea, { marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight }]}>
      <Header navigation={navigation} />
         <CategoriesMenu categories={categories} selectedCategory={selectedCategory} onSelectCategory={handleCategorySelect} />
      <FlatList
        data={filteredMessages}
        keyExtractor={(item) => item.id}
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

const OfferCard = ({ type, value, alertType }) => {
  switch (alertType) {
    case "WARNING":
      return (
        <Card containerStyle={{ backgroundColor: 'orange' }}>
          <Icon name="exclamation-triangle" size={50} color="#fff" />
          <Text style={styles.cardDiscount}>{type}</Text>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>{value}</Text>
        </Card>
      );
    case "INFO":
      return (
        <Card containerStyle={{ backgroundColor: 'blue' }}>
          <Icon name="info-circle" size={50} color="#fff" />
          <Text style={styles.cardDiscount}>{type}</Text>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>{value}</Text>
        </Card>
      );
    case "ALERT":
      return (
        <Card containerStyle={{ backgroundColor: 'red' }}>
          <Icon name="times-circle" size={50} color="#fff" />
          <Text style={styles.cardDiscount}>{type}</Text>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>{value}</Text>
        </Card>
      );
    default:
      return (
        <Card containerStyle={{ backgroundColor: 'green' }}>
          <Icon name="circle" size={50} color="#fff" />
          <Text style={styles.cardDiscount}>{type}</Text>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>{value}</Text>
        </Card>
      );
  }
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