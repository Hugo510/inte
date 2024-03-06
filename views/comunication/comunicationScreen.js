import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Client } from 'paho-mqtt';

const MQTTComponent = (props) => {
  const [messages, setMessages] = useState([]); // Inicializar como arreglo vacío

  useEffect(() => {
    // Crear cliente MQTT con la URI completa y el Client ID
    const clientId = 'clientId_' + Math.random().toString(16).slice(2, 10);
    
    const client = new Client('broker.hivemq.com', Number(8000), clientId);
  
    // Configurar conexión segura
    const options = {
      useSSL: false,
      onSuccess: () => {
        console.log('Conectado a MQTT');
        client.subscribe('/hugo/temperatura');
      },
      onFailure: error => {
        console.log('Conexión fallida:', error);
      },
      // Opciones adicionales para SSL/TLS podrían ser necesarias aquí
      // dependiendo de la configuración del broker y los requerimientos de seguridad
    };
  
    // Manejar la conexión perdida
    client.onConnectionLost = responseObject => {
      if (responseObject.errorCode !== 0) {
        console.log('onConnectionLost:' + responseObject.errorMessage);
      }
    };
  
    // Manejar mensajes entrantes
    client.onMessageArrived = message => {
      console.log('Mensaje recibido:', message.payloadString);
      setMessages(prevMessages => [...prevMessages, message.payloadString]); // Usar 'message.payloadString' aquí
    };
    
  
    // Conectar al broker MQTT
    client.connect(options);
  
    // Limpieza al desmontar el componente
    return () => {
      if (client.isConnected()) {
        client.disconnect();
      }
    };
  }, [props.networkStatus, props.brokerConfig]); // Dependencias añadidas aquí
  

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {messages.map((msg, index) => (
          <Text key={index} style={styles.text}>Mensaje {index + 1}: {msg}</Text>
        ))}
      </ScrollView>
    </View>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5fcff',
  },
  scrollView: {
    width: '100%',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

export default MQTTComponent;
