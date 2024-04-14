import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, Platform, StatusBar, Alert, Modal, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { IconButton } from 'react-native-paper';
import CustomHeader from '../../components/recycle/components/header';
import CategoryScroll from '../../components/recycle/components/categoryScroll';
import AlertCardsList from './components/AlertCardsList'; // Suponiendo que creaste este componente
import DeviceSelector from '../../components/deviceList/DeviceSelector';
import styles from './cardsScreen.styles';

const CardsScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const sensorTypeMapping = {
    'ALL': ['gasDetector', 'ultrasonic', 'temperature', 'humidity'],
    'GASDETECTOR': 'gasDetector',
    'ULTRASONIC': 'ultrasonic',
    'TEMPERATURE': 'temperature',
    'HUMIDITY': 'humidity',
  };

  useEffect(() => {
    const fetchAlerts = async () => {
      setIsLoading(true);
      setError('');
  
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        if (!userToken) throw new Error('Authentication token is missing.');
      
        const deviceId = await AsyncStorage.getItem('@selected_device');
        if (!deviceId) throw new Error('No selected device.');
      
        const mappedSensorTypes = selectedCategory === 'ALL' ?
          sensorTypeMapping['ALL'] :
          [sensorTypeMapping[selectedCategory.toUpperCase()]];
      
        // Asegúrate de que cada tipo de sensor es válido antes de realizar la llamada
        const validSensorTypes = mappedSensorTypes.filter(st => st !== undefined);
      
        if (validSensorTypes.length === 0) {
          throw new Error('No valid sensor types found for the selected category.');
        }

        console.log("Fetching alerts with userToken:", userToken, "and deviceId:", deviceId);

      
        const fetchPromises = validSensorTypes.map(sensorType => ({
          sensorType,
          promise: axios.get(`http://${global.ipDireccion}:3000/api/devices/${deviceId}/sensors/${sensorType}/alerts`, {
            headers: { Authorization: `Bearer ${userToken}` },
          }).then(response => ({ sensorType, response }))
            .catch(error => ({ sensorType, error }))
        }));
      
        const results = await Promise.allSettled(fetchPromises.map(fp => fp.promise));
      
        const alerts = results.flatMap((result, index) => {
          const sensorType = fetchPromises[index].sensorType;  // Accede directamente al sensorType
        
          if (result.status === 'fulfilled' && result.value.response.status === 200) {
            return result.value.response.data.map(alert => ({
              ...alert,
              id: alert._id,
              category: sensorType,
              alertType: alert.messageType,
              value: alert.message,
            }));
          } else {
            const errorDetails = result.reason || (result.value.error ? `HTTP ${result.value.error.response.status}: ${result.value.error.response.statusText}` : 'Unknown error');
            console.error(`Error fetching alerts for sensor type '${sensorType}': ${errorDetails}`);
            return []; // Return an empty array to maintain the structure
          }
        });
        
        
      
        setMessages(alerts);
      } catch (error) {
        console.error('Error fetching sensor alerts:', error);
        setError(error.message || 'An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
      
      
    };
  
    fetchAlerts();
  }, [selectedCategory]);
  
  const handleCategorySelect = category => {
    console.log("Category selected:", category);  // Log the original category selected
    const upperCaseCategory = category.toUpperCase();
    console.log("Category converted to upper case:", upperCaseCategory);  // Log the converted category
    
    setSelectedCategory(upperCaseCategory);  // Convertir a mayúsculas para coincidir con las claves de `sensorTypeMapping`
    
    // Log the mapped sensor types to verify correct mapping
    const mappedSensorTypes = upperCaseCategory === 'ALL' ?
      sensorTypeMapping['ALL'] :
      [sensorTypeMapping[upperCaseCategory]];
  
    console.log("Mapped sensor types for category:", mappedSensorTypes);
  };
  

  const openDeviceSelector = () => {
    setModalVisible(true);
  };

  const handleDeviceSelected = deviceId => {
    setSelectedDevice(deviceId);
    setModalVisible(false);
  };


  return (
    <SafeAreaView style={[styles.safeArea, { marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight }]}>
      <CustomHeader title="Alertas" navigation={navigation} onSearchPress={() => console.log('Buscar')} />
      <IconButton icon="devices" size={24} onPress={openDeviceSelector} />

      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="slide"
      >
        <DeviceSelector onDeviceSelected={handleDeviceSelected} />
      </Modal>

      <CategoryScroll  onSelectCategory={handleCategorySelect} />

      {error ? <Text style={styles.error}>{error}</Text> : <AlertCardsList messages={messages} />}
    </SafeAreaView>
  );
};



export default CardsScreen;

