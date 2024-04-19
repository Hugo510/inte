import React, { useState, useEffect, useCallback } from 'react';
import { View, Text } from 'react-native';
import { Checkbox } from 'react-native-paper';
import {MaterialIcons } from '@expo/vector-icons';
import styles from './userDashboardScreen.styles';
import useDeviceManagement from './hooks/useDeviceManagement';
import DeviceList from './components/DeviceList';
import UserList from './components/AdminList';

const UserDashboardScreen = () => {
  const {
    devices,
    users,
    isLoading,
    loadData,

  } = useDeviceManagement();

    useEffect(() => {
        /* loadData(); */
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


export default UserDashboardScreen;
