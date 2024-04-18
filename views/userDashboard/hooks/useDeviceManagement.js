import React, { useState, useEffect, useCallback } from 'react';
import * as DeviceService from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useDeviceManagement = () => {
    const [devices, setDevices] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [monitoringRequests, setMonitoringRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);  // Nuevo estado para manejar errores
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [selectedAdmin, setSelectedAdmin] = useState(null);

    useEffect(() => {
      loadData();
    }, []);

    const loadData = useCallback(async () => {
      setIsLoading(true);
      setError(null);  // Resetea el error antes de la nueva carga
      try {
        const responses = await Promise.all([
          DeviceService.fetchDevices(),
          DeviceService.fetchAdmins(),
          DeviceService.fetchMonitoringRequests()
        ]);

        // Handle possible errors in individual requests
        responses.forEach((response, index) => {
          if (response.status !== 200) {
            throw new Error(`Failed to load data: ${response.statusText || 'Unknown error'}`);
          }
        });

        setDevices(responses[0].data);
        setAdmins(responses[1].data);
        setMonitoringRequests(responses[2].data);
      } catch (error) {
        console.error('Error loading data:', error);
        setError("Failed to load device management data.");  // Mensaje de error amigable
      } finally {
        setIsLoading(false);
      }
    }, []);

    const dissociateDevice = async (deviceId) => {
      try {
        const response = await DeviceService.dissociateFromDevice(deviceId);
        if (response.status === 200) {
          setDevices(prev => prev.filter(device => device.id !== deviceId));
        } else {
          throw new Error('Failed to dissociate device');
        }
      } catch (error) {
        console.error('Error in dissociateDevice:', error);
        setError("Failed to dissociate device.");  // Mensaje de error amigable
      }
    };

    const dissociateAdmin = async (adminId) => {
      try {
        const response = await DeviceService.dissociateFromAdmin(adminId);
        if (response.status === 200) {
          setAdmins(prev => prev.filter(admin => admin.id !== adminId));
        } else {
          throw new Error('Failed to dissociate admin');
        }
      } catch (error) {
        console.error('Error in dissociateAdmin:', error);
        setError("Failed to dissociate admin.");  // Mensaje de error amigable
      }
    };

    return {
      devices,
      admins,
      monitoringRequests,
      isLoading,
      error,  // Exponer el estado de error
      loadData,
      setSelectedDevice,
      selectedDevice,
      setSelectedAdmin,
      dissociateDevice,
      dissociateAdmin,
    };
};

export default useDeviceManagement;
