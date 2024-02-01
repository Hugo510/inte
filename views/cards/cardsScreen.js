import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, Platform, StatusBar, ScrollView  } from 'react-native';
import { Card } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './cardsScreen.styles';
import { Client } from 'paho-mqtt';

const categories = ['ALL', 'HUMO', 'INFRAROJO', 'TEMPERATURA', 'CAMARA', 'HUMEDAD'];


const CardsScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]); // Estado para un único mensaje
  const [selectedCategory, setSelectedCategory] = useState('ALL'); // Estado para la categoría seleccionada


  
    useEffect(() => {
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
          // Extraer la categoría y si es max o min del topic
          const topicParts = message.destinationName.split('/');
          const category = topicParts[2].toUpperCase(); // Asume que el topic es /hugo/[categoria]/[max|min]
          const type = topicParts[3]; // 'max' o 'min'
      
          // Creando un nuevo mensaje con la información relevante
          const newMessage = {
            category,
            type,
            value: message.payloadString, // El único valor recibido en el mensaje
            id: generateUniqueId()
          };
      
          // Actualiza el estado de mensajes con el nuevo mensaje
          setMessages(prevMessages => [...prevMessages, newMessage]);
        } catch (error) {
          console.error('Error al procesar el mensaje MQTT:', error);
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
    
      const filteredMessages = selectedCategory === 'ALL' 
    ? messages 
    : messages.filter(message => message.type === selectedCategory);

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


const OfferCard = ({ type, content, title, description, code }) => {
  // Determina el tipo de mensaje basado en el contenido
  const isAlert = content.includes("abajo");
  const isWarning = content.includes("advertencia");
  const isInfo = content.includes("información");

  if (isAlert) {
    // Tarjeta para alertas
    return (
      <Card containerStyle={{ backgroundColor: 'red' }}>
        <Icon name="times-circle" size={50} color="#fff" /> 
        <Text style={styles.cardDiscount}>{type}</Text>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Alerta, debajo del nivel</Text>
      </Card>
    );
  } else if (isWarning) {
    // Tarjeta para advertencias
    return (
      <Card containerStyle={{ backgroundColor: 'orange' }}>
        <Icon name="exclamation-triangle" size={50} color="#fff" />
        <Text style={styles.cardDiscount}>{type}</Text>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Advertencia, condición inestable</Text>
      </Card>
    );
  } else if (isInfo) {
    // Tarjeta para información general
    return (
      <Card containerStyle={{ backgroundColor: 'blue' }}>
        <Icon name="info-circle" size={50} color="#fff" />
        <Text style={styles.cardDiscount}>{type}</Text>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Información relevante</Text>
      </Card>
    );
  }

  // Tarjeta general si no se cumplen las condiciones anteriores
  return (
    <Card>
      <Text style={styles.cardDiscount}>{type}</Text>
      <Text>{title}</Text>
      <Text style={styles.cardConditions}>{description}</Text>
      <View style={styles.cardFooter}>
        <Text>{code}</Text>
        <TouchableOpacity style={styles.copyButton} onPress={() => {/* Implementa la función de copiado aquí */}}>
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