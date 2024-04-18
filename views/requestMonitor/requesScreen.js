import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, Alert, Modal, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
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
    setLoading(true);
    const userToken = await AsyncStorage.getItem('userToken');
    const userId = await AsyncStorage.getItem('userId');
    if (!userToken || !userId) {
      Alert.alert("Authentication Error", "Authentication token or user ID not found.", [{ text: "Retry", onPress: () => fetchRequests() }]);
      setLoading(false);
      return;
    }

    const endpoint = `http://${global.ipDireccion}:3000/api/users/${userId}/monitoring-requests`;
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${userToken}` },
      });

      if (response.ok) {
        const data = await response.json();
        const pendingRequests = data.monitoringRequests.filter(request => request.status === 'pending');
        const nonPending = data.monitoringRequests.filter(request => request.status !== 'pending');
        setRequests(pendingRequests);
        setNonPendingRequests(nonPending);
      } else {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Failed to fetch requests data.");
      }
    } catch (error) {
      Alert.alert("Fetch Error", error.message || "An unexpected error occurred while fetching requests.", [{ text: "Retry", onPress: () => fetchRequests() }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pending Monitoring Requests</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Button title="Refresh Requests" onPress={fetchRequests} />
          <FlatList
            data={requests}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => (
              <RequestProcessor request={item} onUpdate={fetchRequests} onDelete={fetchRequests} />
            )}
            style={styles.list}
          />
          <Text style={styles.title}>Request History</Text>
          <Picker
            selectedValue={selectedRequest?._id}
            style={{ height: 50, width: '100%' }}
            onValueChange={(itemValue, itemIndex) => setSelectedRequest(nonPendingRequests.find(r => r._id === itemValue))}
            prompt="Select a request to view details"
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
                <Text style={styles.modalText}>Status: {selectedRequest.status}</Text>
                <Text style={styles.modalText}>Date: {new Date(selectedRequest.date).toLocaleDateString()}</Text>
                <TouchableOpacity style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
                  <Text>Close</Text>
                </TouchableOpacity>
              </View>
            </Modal>
          )}
        </>
      )}
    </View>
  );
};


export default RequestsMonitorScreen;
