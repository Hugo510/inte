import React, { useState, useEffect } from 'react';
import { View, Text, Button, Modal, TextInput, Alert, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RequestProcessor from './RequestProcessor';
import styles from './requesScreen.styles';

const RequestsScreen = () => {
  const [requests, setRequests] = useState([]);
  const [adminEmail, setAdminEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    const userToken = await AsyncStorage.getItem('userToken');
    const userId = await AsyncStorage.getItem('userId');
    if (!userToken || !userId) {
      Alert.alert("Error", "No se encontró el token de autenticación o el ID del usuario.", [{ text: "Reintentar", onPress: () => fetchRequests() }]);
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
        setAdminEmail(data.email);
        setRequests(data.sentMonitoringRequests);
      } else {
        throw new Error("Error al obtener datos de las solicitudes.");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Ocurrió un error inesperado.", [{ text: "Reintentar", onPress: () => fetchRequests() }]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRequest = async () => {
    setAddModalVisible(false);
    setLoading(true);
    const userToken = await AsyncStorage.getItem('userToken');
    const userId = await AsyncStorage.getItem('userId');
    if (!userToken || !userId) {
      Alert.alert("Error", "No se encontró el token de autenticación o el ID del usuario.");
      setLoading(false);
      return;
    }

    const endpoint = `http://${global.ipDireccion}:3000/api/admins/sendMonitoringRequest`;
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: newEmail,
          deviceId: selectedDeviceId // Asegúrate de definir y obtener 'selectedDeviceId' correctamente
        })
      });

      if (!response.ok) {
        throw new Error("Error al enviar la solicitud.");
      }

      Alert.alert("Éxito", "La solicitud se envió correctamente");
      fetchRequests();
    } catch (error) {
      Alert.alert("Error", error.message || "Ocurrió un error inesperado.", [{ text: "Reintentar", onPress: handleAddRequest }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <Button title="Añadir Solicitud" onPress={() => setAddModalVisible(true)} />
          <Text style={styles.title}>Lista de solicitudes</Text>
        </View>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList
            data={requests}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => (
              <RequestProcessor
                request={item}
                adminEmail={adminEmail}
                onUpdate={fetchRequests}
                onDelete={fetchRequests}
              />
            )}
            style={styles.list}
          />
        )}

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
