import React, { useState, useEffect, useCallback } from 'react';
import * as DeviceService from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useDeviceManagement = () => {
    const [devices, setDevices] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [monitoringRequests, setMonitoringRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [selectedAdmin, setSelectedAdmin] = useState(null);

    useEffect(() => {
      /* loadData(); */
    }, []);

    const loadData = useCallback(async () => {
      setIsLoading(true);
      setError(null);

      try {
        const responses = await Promise.all([
          DeviceService.fetchDevices(),
          DeviceService.fetchAdmins(),
          DeviceService.fetchMonitoringRequests()
        ]).catch(error => {
          throw new Error(`Network or CORS error: ${error.message}`);
        });

        const errorMessages = responses.map((response, index) => {
          if (!response.ok) {
            return `Request ${index + 1} failed with status ${response.status}: ${response.statusText}`;
          }
          return null;
        }).filter(Boolean);

        if (errorMessages.length > 0) {
          throw new Error(errorMessages.join('; '));
        }

        setDevices(responses[0].data);
        setAdmins(responses[1].data);
        setMonitoringRequests(responses[2].data);
      } catch (error) {
        console.error('Error loading data:', error);
        setError(`Failed to load device management data: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    }, []);

    const dissociateDevice = async (deviceId) => {
      try {
        const response = await DeviceService.dissociateFromDevice(deviceId);
        if (response.status === 200) {
          setDevices(prev => prev.filter(device => device.id !== deviceId));
        } else if (response.status === 404) {
          throw new Error('Device not found');
        } else {
          throw new Error('Failed to dissociate device');
        }
      } catch (error) {
        console.error('Error in dissociateDevice:', error);
        setError(`Failed to dissociate device: ${error.message}`);
      }
    };

    const dissociateAdmin = async (adminId) => {
      try {
        const response = await DeviceService.dissociateFromAdmin(adminId);
        if (response.status === 200) {
          setAdmins(prev => prev.filter(admin => admin.id !== adminId));
        } else if (response.status === 404) {
          throw new Error('Admin not found');
        } else {
          throw new Error('Failed to dissociate admin');
        }
      } catch (error) {
        console.error('Error in dissociateAdmin:', error);
        setError(`Failed to dissociate admin: ${error.message}`);
      }
    };

    return {
      devices,
      admins,
      monitoringRequests,
      isLoading,
      error,
      loadData,
      setSelectedDevice,
      selectedDevice,
      setSelectedAdmin,
      dissociateDevice,
      dissociateAdmin,
    };
};

export default useDeviceManagement;
