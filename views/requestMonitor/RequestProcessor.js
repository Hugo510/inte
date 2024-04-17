import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RequestProcessor = ({ request, onUpdate, onDelete }) => {
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    setLoading(true);
    const userToken = await AsyncStorage.getItem('userToken');
    if (!userToken) {
      Alert.alert("Authentication Error", "Authentication token not found.");
      setLoading(false);
      return;
    }

    const endpoint = `http://${global.ipDireccion}:3000/api/users/acceptMonitoringRequest/${request.adminId}/${request.id}`;
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${userToken}` },
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Failed to accept the request.");
      }

      Alert.alert("Success", "The request has been accepted.");
      onUpdate();
    } catch (error) {
      Alert.alert("Request Error", error.message || "An unexpected error occurred while accepting the request.");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    Alert.alert(
      "Confirm Rejection",
      "Are you sure you want to reject this request?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject", onPress: async () => {
            setLoading(true);
            const userToken = await AsyncStorage.getItem('userToken');
            if (!userToken) {
              Alert.alert("Authentication Error", "Authentication token not found.");
              setLoading(false);
              return;
            }

            const endpoint = `http://${global.ipDireccion}:3000/api/users/rejectMonitoringRequest/${request.adminId}/${request.id}`;
            try {
              const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${userToken}` },
              });

              if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage || "Failed to reject the request.");
              }

              Alert.alert("Success", "The request has been rejected.");
              onDelete();
            } catch (error) {
              Alert.alert("Request Error", error.message || "An unexpected error occurred while rejecting the request.");
            } finally {
              setLoading(false);
            }
          }
        }
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.requestItem}>
      <Text>Admin ID: {request.adminId}</Text>
      <Text>Device ID: {request.deviceId}</Text>
      <Text>Status: {request.status}</Text>
      {loading ? (
        <ActivityIndicator size="small" color="#0000ff" />
      ) : (
        request.status === 'pending' && (
          <>
            <TouchableOpacity onPress={handleAccept} style={styles.acceptButton} disabled={loading}>
              <Text>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setDeleteModalVisible(true)} style={styles.deleteButton}>
              <Text>Reject</Text>
            </TouchableOpacity>
          </>
        )
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isDeleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text>Are you sure you want to reject this request?</Text>
          <TouchableOpacity onPress={handleReject} style={styles.modalButton}>
            <Text>Reject</Text>
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
    backgroundColor: '#4CAF50',
    padding: 10,
    margin: 10,
  },
  deleteButton: {
    backgroundColor: '#f44336',
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    margin: 10,
  },
});

export default RequestProcessor;
