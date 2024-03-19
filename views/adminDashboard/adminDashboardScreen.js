import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button, FlatList, Alert, ActivityIndicator, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import { Checkbox } from 'react-native-paper';
import {MaterialIcons } from '@expo/vector-icons';
import styles from './adminDashboardScreen.styles';
import useDeviceManagement from './hooks/useDeviceManagement';
import DeviceList from './components/DeviceList';
import UserList from './components/UserList';

const AdminDashboardScreen = () => {
  const {
    openModal,
    closeModal,
    openRequestModal,
    closeRequestModal,
    devices,
    users,
    monitoringRequests,
    isLoading,
    loadData,
    setSelectedDevice,
    selectedDevice,
    addDevice,
    assignDeviceToUser,
    unassignDeviceFromUser,
    removeUser,
    deleteDevice,
    assignUsersToSelectedDevice,
    unaAssignUsersToSelectedDevice,
    // ... (Todas las funciones importadas del hook)
  } = useDeviceManagement();

    useEffect(() => {
        loadData();
      }, []);
  

return (
  <View style={styles.container}>
    {!isLoading && (
      <>
        <Text style={styles.title}>Gestión de Dispositivos y Usuarios</Text>
        
        <UserList
          users={users}
          
        />
        
        <DeviceList
          devices={devices}
        />
        
      </>
    )}
  </View>
);


  
};


export default AdminDashboardScreen;
