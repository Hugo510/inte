import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { Card } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './cardsScreen.styles';
import { Client } from 'paho-mqtt';

// Simulando datos de las tarjetas


const cardsData = [
  {
    id: '1',
    type: '50%',
    title: 'FLAT 50% off upto $50 Surprise Cashback',
    description: 'Only on Healthcare Products On Orders above $100',
    code: 'BCH12'
  },
  // ...otros datos de tarjetas
];

const categories = ['ALL', 'HUMO', 'INFRAROJO', 'TEMPERATURA'];


const CardsScreen = ({ navigation }) => {
    const [messages, setMessages] = useState([]); // Estado para los mensajes MQTT
  const [selectedCategory, setSelectedCategory] = useState('ALL'); // Estado para la categoría seleccionada


  
    useEffect(() => {
      const clientId = 'clientId_' + Math.random().toString(16).slice(2, 8);
      const client = new Client('broker.hivemq.com', 8000, clientId);
  
      const options = {
        useSSL: false,
        onSuccess: () => {
          console.log('Conectado a MQTT');
          client.subscribe('/hugo/temperatura');
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
          const newMessage = JSON.parse(message.payloadString);
          if (categories.includes(newMessage.type)) { // Asegúrate de que el tipo sea válido
            const newMessageWithId = { ...newMessage, id: generateUniqueId() };
            setMessages(prevMessages => [newMessageWithId, ...prevMessages]);
          }
        } catch (error) {
          console.error('Error al parsear el mensaje MQTT:', error);
        }
      };
      
      // Función para generar un ID único (puede ser tan simple o complejo como necesites)
      function generateUniqueId() {
        return Math.random().toString(36).slice(2, 9);
      }
  
      client.connect(options);
  
      return () => client.disconnect();
    }, []);

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
      };
    
      const filteredMessages = messages.filter((message) => {
        return selectedCategory === 'ALL' || message.type === selectedCategory;
      });    
    
  
    return (
      <SafeAreaView style={[styles.safeArea, { marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight }]}>
         <Header navigation={navigation} />
      <CategoriesMenu selectedCategory={selectedCategory} onSelectCategory={handleCategorySelect} />
        <FlatList
          data={filteredMessages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <OfferCard {...item} />}
          //ListHeaderComponent={<CategoriesMenu />}
          //ListFooterComponent={<View style={{ paddingBottom: 20 }} />}
        />
        <BottomNavBar />
      </SafeAreaView>
    );
  };

const Header = (navigation) => (
  <View style={styles.headerContainer}>
    <Icon name="arrow-left" size={24} color="#000" onPress={() => navigation.goBack()} />
    <Text style={styles.headerTitle}>OFFERS</Text>
    <Icon name="search" size={24} color="#000" onPress={() => {/* lógica de búsqueda */}} />
  </View>
);


const CategoriesMenu = ({ selectedCategory, onSelectCategory }) => {
    
  
    return (
      <View style={styles.categoriesContainer}>
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
      </View>
    );
  };

const OfferCard = ({ type, title, description, code }) => {

  return (
  <Card>
    <Text style={styles.cardDiscount}>{type}</Text>
    <Text>{title}</Text>
    <Text style={styles.cardConditions}>{description}</Text>
    <View style={styles.cardFooter}>
      <Text>{code}</Text>
      <TouchableOpacity style={styles.copyButton} onPress={() => copyToClipboard(code)}>
        <Text>COPY CODE</Text>
      </TouchableOpacity>
    </View>
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


/* {
  "type": "TEMPERATURA",
  "title": "Oferta Especial en Detectores de Humo",
  "description": "Descuento del 20% en todos los detectores de humo esta semana.",
  "code": "SMOKE20"
}

 */