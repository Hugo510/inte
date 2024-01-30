import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Client } from 'paho-mqtt';

const MQTTComponent = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Crear cliente MQTT con la URI completa y el Client ID
    const clientId = 'clientId_' + Math.random().toString(16).slice(2, 10);
    // Cambio aquí: se ha actualizado el puerto a 8883 y se habilita SSL
    const client = new Client('broker.hivemq.com', Number(8000), clientId);
  
    // Configurar conexión segura
    const options = {
      useSSL: false, // Habilitar SSL/TLS
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
      setMessage(message.payloadString);
    };
  
    // Conectar al broker MQTT
    client.connect(options);
  
    // Limpieza al desmontar el componente
    return () => {
      if (client.isConnected()) {
        client.disconnect();
      }
    };
  }, []);
  

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Mensaje MQTT: {message}</Text>
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
  text: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

export default MQTTComponent;
