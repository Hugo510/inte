import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Alert, ScrollView, ActivityIndicator } from 'react-native';
import Slider from '@react-native-community/slider';
import { fetchSensorData, updateSensorParameter } from '../../../views/editParameters/sensorService';

  const SensorParams = ({ selectedCategory, selectedDevice }) => {
    console.log("Pasando selectedCategory a SensorParams:", selectedCategory);
    const [sensorValues, setSensorValues] = useState({
      gasDetector: { sensitivity: 0 },
      humidity: { max: 0, min: 0 },
      temperature: { max: 0, min: 0 },
      ultrasonic: { range: 0 },
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');


    useEffect(() => {
      /* console.log("Selected Device:", selectedDevice);
      console.log("Selected Category:", selectedCategory); */
      const loadData = async () => {
        if (!selectedDevice) {
          setLoading(false);
          setError('No se ha seleccionado ningún dispositivo.');
          return;
        }
        setLoading(true);
        setError('');
        try {
          const data = await fetchSensorData(selectedDevice);
          //console.log('Datos cargados:', data); // Para debugging
          setSensorValues(data);
        } catch (error) {
          console.error('Error cargando los datos de los sensores:', error);
          setError('No se pudieron cargar los datos de los sensores. Por favor, intente de nuevo.');
          Alert.alert("Error", "No se pudieron cargar los datos de los sensores. ¿Desea intentarlo de nuevo?", [
            { text: "No", style: "cancel" },
            { text: "Sí", onPress: loadData } // Asegúrate de que esto reintente correctamente
          ]);
        } finally {
          setLoading(false);
        }
      };
      console.log("selectedCategory recibido en SensorParameters:", selectedCategory);
  
      loadData();
    }, [selectedDevice, selectedCategory]);
    
      

    const handleValueChange = (sensorKey, paramKey, value) => {
      setSensorValues(prev => ({
        ...prev,
        [sensorKey]: {
          ...prev[sensorKey],
          [paramKey]: value,
        },
      }));
    };
    

    const handleUpdateAll = async () => {
      if (Object.keys(sensorValues).length === 0) {
        Alert.alert("Error", "No hay datos de sensores para actualizar.");
        return;
      }
  
      try {
        const updatePromises = Object.keys(sensorValues).map(sensorKey => {
          const parametersToUpdate = { parameters: sensorValues[sensorKey] };
          return updateSensorParameter(sensorKey, parametersToUpdate);
        });
  
        await Promise.all(updatePromises);
        Alert.alert("Éxito", "Todos los sensores han sido actualizados correctamente.");
      } catch (error) {
        console.error("Error al actualizar los sensores:", error);
        setError("No se pudieron actualizar los sensores. Por favor, intente nuevamente.");
      }
    };

    const renderSensorControls = () => {
      if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
      }
    
      if (error) {
        return (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <Button title="Reintentar" onPress={loadData} />
          </View>
        );
      }
    
      // Asegúrate de que selectedCategory es válido
      const sensorsToShow = selectedCategory === 'ALL' ? Object.keys(sensorValues) : 
                             (sensorValues[selectedCategory] ? [selectedCategory] : []);
    
      if (sensorsToShow.length === 0) {
        return <Text style={styles.errorText}>No hay datos disponibles para mostrar.</Text>;
      }
    
      return sensorsToShow.map(sensorKey => {
        const params = Object.keys(sensorValues[sensorKey]);
        return params.map(paramKey => (
          <View key={`${sensorKey}-${paramKey}`} style={styles.controlContainer}>
            <Text>{`${paramKey}:`}</Text>
            <TextInput
              style={styles.input}
              value={String(sensorValues[sensorKey][paramKey])}
              onChangeText={(value) => handleValueChange(sensorKey, paramKey, parseFloat(value))}
              keyboardType="numeric"
            />
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100} // Este valor puede necesitar ser ajustado según el tipo de sensor
              value={parseFloat(sensorValues[sensorKey][paramKey])}
              onValueChange={(value) => handleValueChange(sensorKey, paramKey, value)}
              minimumTrackTintColor="#1fb28a"
              maximumTrackTintColor="#d3d3d3"
              thumbTintColor="#b9e4c9"
            />
          </View>
        ));
      });
    };
    
  

    return (
      <ScrollView style={styles.container}>
        {renderSensorControls()}
        {!loading && !error && <Button title="Actualizar" onPress={handleUpdateAll} />}
      </ScrollView>
    );
  };


const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
      backgroundColor: '#fff', // Fondo claro para contraste con los elementos
    },
    controlContainer: {
      marginVertical: 20,
      paddingHorizontal: 10,
    },
    sensorSection: {
      marginBottom: 30,
      paddingHorizontal: 5,
      paddingVertical: 10,
      borderRadius: 8,
      backgroundColor: '#f9f9f9', // Un ligero fondo para cada sección de sensor para separarlas visualmente
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5, // Sombra para dar un efecto elevado a cada sección
    },
    sensorTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 15,
      textAlign: 'center', // Centrar el título para una apariencia uniforme
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 10,
      paddingHorizontal: 10,
      fontSize: 16,
      color: '#333',
      backgroundColor: '#fff', // Fondo blanco para el input para destacar sobre el fondo de la sección
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3, // Sombra suave para el input para mejorar la percepción de interactividad
    },
    slider: {
      width: '100%',
      height: 40,
    },
    errorText: {
      color: 'red',
      marginTop: 20,
      textAlign: 'center',
    },
    
  });
  

export default SensorParams;
