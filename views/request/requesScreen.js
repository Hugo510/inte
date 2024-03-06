import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from './requesScreen.styles';

// Suponiendo que esta información viene de una API o base de datos
const adminData = {
    nombre: 'Carlos',
    profilePictureUrl: 'https://example.com/path-to-admin-image.jpg',
  };
  
  // Datos simulados de las solicitudes
  const monitoringRequests = [
    {
      id: '1',
      adminId: 'admin1',
      status: 'pending',
      sentAt: new Date().toLocaleDateString(),
      // Otros datos relevantes para la solicitud...
    },
    // ...más solicitudes
  ];
  
  const RequestItem = ({ request, onAccept, onReject }) => (
    <View style={styles.requestItem}>
      <Text style={styles.requestText}>Solicitud enviada en: {request.sentAt}</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={() => onAccept(request.id)} style={styles.acceptButton}>
          <Text style={styles.buttonText}>Aceptar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onReject(request.id)} style={styles.rejectButton}>
          <Text style={styles.buttonText}>Rechazar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  const RequestsScreen = () => {
    const [requests, setRequests] = useState(monitoringRequests);
  
    const handleAccept = (requestId) => {
      // Lógica para aceptar la solicitud
      console.log('Aceptar', requestId);
    };
  
    const handleReject = (requestId) => {
      // Lógica para rechazar la solicitud
      console.log('Rechazar', requestId);
    };
  
    useEffect(() => {
      // Aquí se cargarían las solicitudes desde una API
    }, []);
  
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={{ uri: adminData.profilePictureUrl }} style={styles.profilePic} />
          <Text style={styles.title}>{`${adminData.nombre} te invita a unirte a su equipo`}</Text>
        </View>
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RequestItem request={item} onAccept={handleAccept} onReject={handleReject} />
          )}
          style={styles.list}
        />
      </View>
    );
  };
  export default RequestsScreen;