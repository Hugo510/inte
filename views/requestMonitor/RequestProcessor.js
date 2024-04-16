import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RequestProcessor = ({ request, onUpdate, onDelete }) => {
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    setLoading(true);
    const userToken = await AsyncStorage.getItem('userToken');
    if (!userToken) {
      Alert.alert("Error", "No se encontró el token de autenticación.");
      setLoading(false);
      return;
    }

    const endpoint = `http://${global.ipDireccion}:3000/api/users/acceptMonitoringRequest/${request.adminId}`;
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Error al aceptar la solicitud.");
      }

      Alert.alert("Éxito", "La solicitud ha sido aceptada.");
      onUpdate();
    } catch (error) {
      Alert.alert("Error", error.message || "Ocurrió un error inesperado al aceptar la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    const userToken = await AsyncStorage.getItem('userToken');
    if (!userToken) {
      Alert.alert("Error", "No se encontró el token de autenticación.");
      setLoading(false);
      return;
    }

    const endpoint = `http://${global.ipDireccion}:3000/api/users/rejectMonitoringRequest/${request.adminId}`;
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Error al rechazar la solicitud.");
      }

      Alert.alert("Éxito", "La solicitud ha sido rechazada.");
      onDelete();
    } catch (error) {
      Alert.alert("Error", error.message || "Ocurrió un error inesperado al rechazar la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.requestItem}>
      <Text>Admin ID: {request.adminId}</Text>
      <Text>Device ID: {request.deviceId}</Text>
      <Text>Estado: {request.status}</Text>
      {request.status === 'pending' && (
        <>
          <TouchableOpacity onPress={handleAccept} style={styles.acceptButton}>
            <Text>Aceptar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setDeleteModalVisible(true)} style={styles.deleteButton}>
            <Text>Rechazar</Text>
          </TouchableOpacity>
        </>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={isDeleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text>¿Estás seguro de que quieres rechazar esta solicitud?</Text>
          <TouchableOpacity onPress={handleDelete} style={styles.modalButton}>
            <Text>Rechazar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  requestItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    marginBottom: 10,
    padding: 10,
  },
  acceptButton: {
    backgroundColor: '#4CAF50', // Green
    padding: 10,
    margin: 10,
  },
  deleteButton: {
    backgroundColor: '#f44336', // Red
    padding: 10,
    margin: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalButton: {
    backgroundColor: '#2196F3', // Blue
    padding: 10,
    margin: 10,
  },
});

export default RequestProcessor;
