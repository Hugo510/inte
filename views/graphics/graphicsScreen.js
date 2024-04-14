import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Platform, StatusBar, ScrollView, Dimensions, ActivityIndicator, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './graphicsScreen.styles';

import chartConfig from './components/ChartConfig';
import { IconButton } from 'react-native-paper';

import CustomHeader from '../../components/recycle/components/header';
import CategoryScroll from '../../components/recycle/components/categoryScroll';
import DeviceSelector from '../../components/deviceList/DeviceSelector';
import ChartRenderer from './components/ChartRenderer';
import { fetchDataForSensor } from './services/SensorDataService';


const screenWidth = Dimensions.get("window").width; // Obtener el ancho de la pantalla para el gráfico


const GraphicScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [graphData, setGraphData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    checkSelectedDevice();
    if (selectedCategory) {
      fetchDataForSensor(selectedCategory, setGraphData, setIsLoading, setError);
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
        setIsLoading(false);
      }
    };

  

  // Asegúrate de que la categoría se pasa correctamente.
  const handleCategorySelect = category => {
    setSelectedCategory(category);
  };

  const handleDeviceSelected = deviceId => {
    setSelectedDevice(deviceId);
    setModalVisible(false);
  };

  const openDeviceSelector = () => {
    setModalVisible(true);
  };
  

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomHeader title="Gráficas de Sensores" navigation={navigation} />
      <IconButton icon="devices" size={24} onPress={openDeviceSelector} />
      <Modal visible={modalVisible} onRequestClose={() => setModalVisible(false)} animationType="slide">
        <DeviceSelector onDeviceSelected={handleDeviceSelected} />
      </Modal>
      <CategoryScroll onSelectCategory={handleCategorySelect} />
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text>{error}</Text>
      ) : (
        <ChartRenderer graphData={graphData} screenWidth={screenWidth} chartConfig={chartConfig} />
      )}
    </SafeAreaView>
  );


  

};


export default GraphicScreen;
