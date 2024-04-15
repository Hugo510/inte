import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Platform, StatusBar, ScrollView, Dimensions, ActivityIndicator, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './graphicsScreen.styles';


import { chartConfig } from './components/ChartConfig';
import { IconButton } from 'react-native-paper';

import CustomHeader from '../../components/recycle/components/header';
import CategoryScroll from '../../components/recycle/components/categoryScroll';
import DeviceSelector from '../../components/deviceList/DeviceSelector';
import ChartRenderer from './components/ChartRenderer';
import AdvancedChartOptions from './components/AdvancedChartOptions';

import { fetchDataForSensor } from './services/SensorDataService';
import validateSensorData from './services/validateSensorData';


const screenWidth = Dimensions.get("window").width; // Obtener el ancho de la pantalla para el gráfico


const GraphicScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [graphData, setGraphData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
   // Ref para verificar si el componente está montado
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    checkSelectedDevice();
    if (selectedCategory) {
      fetchDataForSensor(selectedCategory, (data) => {
        if (mountedRef.current) {
          console.log("Before setGraphData:", JSON.stringify(data));
          setGraphData(data);
          console.log("Data set in state via setGraphData:", JSON.stringify(data));
        }
      }, setIsLoading, setError);
    }
  }, [selectedCategory]);

  const checkSelectedDevice = async () => {
    setIsLoading(true);
    try {
      const deviceId = await AsyncStorage.getItem('@selected_device');
      if (deviceId) {
        setSelectedDevice(deviceId);
      } else {
        console.log("No se encontró el dispositivo seleccionado en AsyncStorage");
      }
    } catch (error) {
      console.error("Error al recuperar el dispositivo seleccionado de AsyncStorage:", error);
    } finally {
      if (mountedRef.current) { setIsLoading(false); }
    }
  };


  // Asegúrate de que la categoría se pasa correctamente.
  const handleCategorySelect = category => {
    console.log("Category selected:", category); // Debugging: Registro de categoría seleccionada
    setSelectedCategory(category);
  };

  const handleDeviceSelected = deviceId => {
    setSelectedDevice(deviceId);
    setModalVisible(false);
  };

  const openDeviceSelector = () => {
    setModalVisible(true);
  };

  const dataIsValid = () => {
    const sensorType = selectedCategory.toLowerCase(); // Assuming category matches sensor types
    console.log(sensorType)
    console.log(graphData)
    return validateSensorData(graphData, sensorType);
  };
  

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomHeader title="Gráficas de Sensores" navigation={navigation} />
      <IconButton icon="devices" size={24} onPress={openDeviceSelector} />
      <Modal visible={modalVisible} onRequestClose={() => setModalVisible(false)} animationType="slide">
        <DeviceSelector onDeviceSelected={handleDeviceSelected} />
      </Modal>
      <AdvancedChartOptions graphData={graphData} />
      <CategoryScroll onSelectCategory={handleCategorySelect} />
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text>{error}</Text>
      ) : dataIsValid(graphData) ? (
        <ChartRenderer graphData={graphData} screenWidth={screenWidth} chartConfig={chartConfig} />
      ) : (
        <Text>No hay datos válidos para mostrar en el gráfico</Text>
      )}
    </SafeAreaView>
  );


  

};


export default GraphicScreen;
