import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, StatusBar  } from 'react-native';
import Slider from '@react-native-community/slider';
import styles from './dashboardScreen.styles';
import { Client, Message  } from 'paho-mqtt';


const categories = ['HUMO', 'INFRAROJO', 'TEMPERATURA', 'CAMARA', 'HUMEDAD'];

const TabMenu = ({ categories, selectedCategory, onSelectCategory }) => {
    return (
      <View style={styles.tabMenuContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.tabButton,
                selectedCategory === category && styles.tabButtonSelected,
              ]}
              onPress={() => onSelectCategory(category)}
            >
              <Text style={styles.tabButtonText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

const RangeSlider = ({ category, values, onValueChange, onSend }) => {
    return (
      <View style={styles.sliderRow}>
        <Text style={styles.text}>{category}</Text>
        <View>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={values.min}
            onValueChange={(value) => onValueChange(category, 'min', value)}
          />
          <Text style={styles.minMaxText}>Min: {values.min.toFixed(0)}</Text>
        </View>
        <View>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={values.max}
            onValueChange={(value) => onValueChange(category, 'max', value)}
          />
          <Text style={styles.minMaxText}>Max: {values.max.toFixed(0)}</Text>
        </View>
        <TouchableOpacity
                style={styles.sendButton}
                onPress={() => onSend(category, values)}
            >
                <Text style={styles.sendButtonText}>Enviar</Text>
            </TouchableOpacity>

      </View>
    );
  };

  const DashboardScreen = () => {
    const [messages, setMessages] = useState([]); // Estado para los mensajes MQTT
    const [client, setClient] = useState(null);

    useEffect(() => {
        const clientId = 'clientId_' + Math.random().toString(16).slice(2, 8);
        const newClient = new Client('broker.hivemq.com', 8000, clientId);
    
        const options = {
            useSSL: false,
            onSuccess: () => {
                console.log('Conectado a MQTT');
            },
            onFailure: (error) => {
                console.log('Conexión fallida:', error);
            },
        };
        setClient(newClient); // Actualizar el estado con el nuevo cliente

    
        newClient.connect(options);
        setClient(newClient);
    
        return () => {
            newClient.disconnect();
        };
    }, []);
    
    

    const [selectedCategory, setSelectedCategory] = useState(categories[0]);
    const [sliderValues, setSliderValues] = useState(
      categories.reduce((acc, category) => {
        acc[category] = { min: 0, max: 100 };
        return acc;
      }, {})
    );
  
    
    const updateSliderValue = (category, type, value) => {
        // Lógica para prevenir que el mínimo sea mayor que el máximo y viceversa
        if (type === 'min' && value > sliderValues[category].max) return;
        if (type === 'max' && value < sliderValues[category].min) return;
    
        setSliderValues({
            ...sliderValues,
            [category]: {
                ...sliderValues[category],
                [type]: value,
            },
        });

        /* if (client) {
            
            const sliderData = {
                type,
                value
            };
            const message = new Message(JSON.stringify(sliderData));
            message.destinationName = `/hugo/${category}`;
            
        console.log(`Enviando mensaje a MQTT: ${message.payloadString}`);
        console.log(`Topic: ${message.destinationName}`);

        client.send(message);
        } */
    };

    const sendMessage = (category, values) => {
      if (client) {
        // Enviar mensaje para el valor mínimo
        const minMessage = new Message(JSON.stringify({ value: values.min }));
        minMessage.destinationName = `/hugo/${category}/min`;
        console.log(`Enviando mensaje mínimo a MQTT: ${minMessage.payloadString}`);
        console.log(`Topic: ${minMessage.destinationName}`);
        client.send(minMessage);
    
        // Enviar mensaje para el valor máximo
        const maxMessage = new Message(JSON.stringify({ value: values.max }));
        maxMessage.destinationName = `/hugo/${category}/max`;
        console.log(`Enviando mensaje máximo a MQTT: ${maxMessage.payloadString}`);
        console.log(`Topic: ${maxMessage.destinationName}`);
        client.send(maxMessage);
      }
    };
  
    return (
        <SafeAreaView style={styles.safeArea}>
          {/* StatusBar personalizado para Android */}
          {Platform.OS === 'android' && <StatusBar backgroundColor="#f5f5f5" />}
          <TabMenu
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.container}>
              {/* <RangeSlider
                key={selectedCategory}
                category={selectedCategory}
                values={sliderValues[selectedCategory]}
                onValueChange={updateSliderValue}
              /> */}
              <RangeSlider
    key={selectedCategory}
    category={selectedCategory}
    values={sliderValues[selectedCategory]}
    onValueChange={updateSliderValue}
    onSend={sendMessage}
/>

            </View>
          </ScrollView>
        </SafeAreaView>
      );
    };


export default DashboardScreen;
