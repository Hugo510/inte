import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, Alert, Modal, TouchableOpacity, Picker, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RequestProcessor from './RequestProcessor';
import styles from './requesScreen.styles';

const RequestsMonitorScreen = () => {
  const [requests, setRequests] = useState([]);
  const [nonPendingRequests, setNonPendingRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    const endpoint = `http://${global.ipDireccion}:3000/api/users/${userId}/monitoring-requests`;
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const pendingRequests = data.monitoringRequests.filter(request => request.status === 'pending');
        const nonPending = data.monitoringRequests.filter(request => request.status !== 'pending');
        setRequests(pendingRequests);
        setNonPendingRequests(nonPending);
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

  const handleRefresh = () => {
    fetchRequests();
  };

  const openModalWithRequestDetails = (requestId) => {
    const request = nonPendingRequests.find(r => r._id === requestId);
    setSelectedRequest(request);
    setIsModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de solicitudes de monitoreo pendientes</Text>
      <Button title="Refrescar solicitudes" onPress={handleRefresh} />
      <FlatList
        data={requests}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <RequestProcessor
            request={item}
            onUpdate={handleRefresh}
            onDelete={handleRefresh}
          />
        )}
        style={styles.list}
      />
      <Text style={styles.title}>Historial de Solicitudes</Text>
      <Picker
        selectedValue={selectedRequest?._id}
        style={{ height: 50, width: '100%' }}
        onValueChange={(itemValue, itemIndex) => openModalWithRequestDetails(itemValue)}
      >
        {nonPendingRequests.map((request, index) => (
          <Picker.Item key={index} label={`${request.status} - ${request.deviceId}`} value={request._id} />
        ))}
      </Picker>
      {selectedRequest && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Admin ID: {selectedRequest.adminId}</Text>
            <Text style={styles.modalText}>Device ID: {selectedRequest.deviceId}</Text>
            <Text style={styles.modalText}>Estado: {selectedRequest.status}</Text>
            <Text style={styles.modalText}>Fecha: {selectedRequest.date}</Text>  {/* Asumiendo que la fecha está disponible */}
            <TouchableOpacity style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
              <Text>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  modalContent: {
    marginTop: 50,
    padding: 20,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  closeButton: {
    padding: 10,
    backgroundColor: '#ddd',
    alignSelf: 'center',
  },
  list: {
    marginBottom: 10,
  },
});

export default RequestsMonitorScreen;
