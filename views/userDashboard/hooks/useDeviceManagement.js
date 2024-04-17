// useDeviceManagement.js
import React, { useState, useEffect, useCallback } from 'react';
import * as DeviceService from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


const useDeviceManagement = () => {
    const [devices, setDevices] = useState([]);
    const [users, setUsers] = useState([]);
    const [monitoringRequests, setMonitoringRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [userEmail, setUserEmail] = useState('');

  // Carga inicial de dispositivos
  useEffect(() => {
    loadData();
  }, []);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const deviceResponse = await DeviceService.fetchDevices();
      const userResponse = await DeviceService.fetchUsers();
      const monitoringRequestResponse = await DeviceService.fetchMonitoringRequests();
      if (deviceResponse.status === 200) {
        setDevices(deviceResponse.data);
      } else {
        console.error('Error fetching devices:', deviceResponse.status);
      }
      if (userResponse.status === 200) {
        setUsers(userResponse.data);
      } else {
        console.error('Error fetching users:', userResponse.status);
      }
      if (monitoringRequestResponse.status === 200) {
        setMonitoringRequests(monitoringRequestResponse.data);
      } else {
        console.error('Error fetching monitoring requests:', monitoringRequestResponse.status);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

 

  return {
    devices,
    users,
    monitoringRequests,
    isLoading,
    loadData,
    setSelectedDevice,
    selectedDevice,
  };
};

export default useDeviceManagement;
