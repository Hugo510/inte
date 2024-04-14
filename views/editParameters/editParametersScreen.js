// Asegúrate de ajustar las importaciones y rutas según sea necesario
import React, { useState, useEffect } from 'react';
import { ScrollView, View, TouchableOpacity, Modal, Text, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../../components/recycle/components/header';
import CategoryScroll from '../../components/recycle/components/categoryScroll';
import SensorParams from '../../components/recycle/components/SensorParams';
import DeviceSelector from '../../components/deviceList/DeviceSelector';
import { IconButton } from 'react-native-paper';
import { styles } from './editParametersScreen.styles';

const EditParametersScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
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
    console.log("selectedCategory actualizado en EditParametersScreen:", selectedCategory);
  
    checkSelectedDevice();
  }, [selectedCategory]);
  

  const openDeviceSelector = () => {
    setModalVisible(true);
  };

  const handleDeviceSelected = (deviceId) => {
    setSelectedDevice(deviceId);
    setModalVisible(false); // Cierra el modal una vez seleccionado el dispositivo
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="Editar Parámetros" navigation={navigation} onSearchPress={() => console.log('Buscar')} />
      <IconButton icon="devices" size={24} onPress={openDeviceSelector} />

      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="slide"
      >
        <DeviceSelector onDeviceSelected={handleDeviceSelected} />
      </Modal>

      {selectedDevice ? (
        isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <CategoryScroll onSelectCategory={setSelectedCategory} />
            <ScrollView style={styles.parametersContainer}>
              
              <SensorParams selectedCategory={selectedCategory} selectedDevice={selectedDevice} />
            </ScrollView>
          </>
        )
      ) : (
        <Text style={styles.selectDeviceText}>Seleccione un dispositivo para editar sus parámetros.</Text>
      )}
    </View>
  );
};

export default EditParametersScreen;
