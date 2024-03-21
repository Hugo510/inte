import React, { useState, useEffect } from 'react';
import { View, Text, Button, Modal, TextInput, Alert, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RequestProcessor from './RequestProcessor'; // Asegúrate de que el componente esté correctamente importado
import styles from './requesScreen.styles';
  
  const RequestsScreen = () => {
    const [requests, setRequests] = useState([]);

    const [adminEmail, setAdminEmail] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [loading, setLoading] = useState(true); // Asegúrate de definir este estado si lo vas a usar

    const [addModalVisible, setAddModalVisible] = useState(false);
    
  
    useEffect(() => {
      // Aquí se cargarían las solicitudes desde una API
      fetchRequests();
    }, []);
    
    const fetchRequests = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('userId');
      if (!userToken || !userId) {
        Alert.alert("Error", "No se encontró el token de autenticación o el ID del usuario.");
        setLoading(false);
        return;
      }

      const endpoint = `http://${global.ipDireccion}:3000/api/admins/${userId}/monitoring-requests`;

      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${userToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data)
          // Asumiendo que tienes un estado para almacenar el email del admin
          setAdminEmail(data.email); // Actualiza el estado con el nuevo email del admin

          setRequests(data.sentMonitoringRequests); // Actualiza las solicitudes
          console.log(data)
        } else {
          const errorMessage = await response.text();
          throw new Error(errorMessage || "Error al obtener datos de las solicitudes.");
        }
      } catch (error) {
        Alert.alert("Error", error.message || "Ocurrió un error inesperado.");
      } finally {
        setLoading(false);
      }
    };
  
  
    
    const handleAddRequest = async () => {
      setAddModalVisible(false);
      const userToken = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('userId');
      
      if (!userToken || !userId) {
        Alert.alert("Error", "No se encontró el token de autenticación o el ID del usuario.");
        return;
      }
  
      const endpoint = `http://${global.ipDireccion}:3000/api/admins/sendMonitoringRequest`; // Ajusta este endpoint a tu API
  
      try {
        setLoading(true);
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userEmail: newEmail}) // Ajusta esto según el cuerpo esperado por tu API
        });
  
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage || "Error al enviar la solicitud.");
        }
  
        Alert.alert("Éxito", "La solicitud se envió correctamente");
        fetchRequests(); // Actualiza la lista de solicitudes
      } catch (error) {
        Alert.alert("Error", error.message || "Ocurrió un error inesperado al enviar la solicitud.");
      } finally {
        setLoading(false);
      }
    };

    const handleAdd = () => {
      setAddModalVisible(true);
    };

    const handleRefresh = () => {
      fetchRequests();
    };
  

    return (
      <>
      <View style={styles.container}>
        <View style={styles.header}>
          {/* <Image source={{ uri: adminData.profilePictureUrl }} style={styles.profilePic} /> */}
          <Button title="Añadir Solicitud" onPress={handleAdd} />
          <Text style={styles.title}> Lista de solicitudes</Text>
        </View>
        <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RequestProcessor
            request={item}
            adminEmail={adminEmail} // Pasando el email del admin a cada RequestProcessor
            onUpdate={handleRefresh} // Aquí pasas el callback para actualizar
            onDelete={handleRefresh} // Aquí pasas el callback para actualizar
          />
        )}
        style={styles.list}
      />


      {/* Modal para añadir nueva solicitud */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addModalVisible}
        onRequestClose={() => setAddModalVisible(false)}>
        <View style={styles.modalView}>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setNewEmail(text)}
            value={newEmail}
            placeholder="Introduce el email"
          />
          <Button title="Enviar Solicitud" onPress={handleAddRequest} />
        </View>
      </Modal>
      </View>
      </>
    );
  };


  export default RequestsScreen;