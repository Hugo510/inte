import React, { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity, Text, View, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import useDeviceManagement from '../hooks/useDeviceManagement'; // Asegúrate de que la ruta sea correcta

const DeviceList = () => {
  /* const {
    devices,
    loadData,
    setSelectedDevice,
    dissociateDevice, // Asegúrate de que esta línea esté agregada para obtener la función del hook
    error, // Asegúrate de importar el estado de error del hook
  } = useDeviceManagement(); */

  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [error, setError] = useState(null);

  const devicesSample = [
    {
      _id: '1',
      room: 'Sala de estar',
    },
    {
      _id: '2',
      room: 'Cocina',
    },
    {
      _id: '3',
      room: 'Dormitorio principal',
    },
    {
      _id: '4',
      room: 'Oficina en casa',
    },
  ];
  

  useEffect(() => {
    // Simulando la carga de datos
    setDevices(devicesSample);  // Utiliza el arreglo de muestra
    setError(null);
    /* loadData(); // Carga los dispositivos cuando el componente se monta */
  }, []);

  const dissociateDevice = async (deviceId) => {
    console.log('Dissociating device with ID:', deviceId);
    // Simular éxito o error en la operación
    const isSuccess = true; // Cambiar a false para simular un error
    return { ok: isSuccess, message: isSuccess ? null : 'No se pudo desasociar el dispositivo' };
  };

  const loadData = async () => {
    // Simular recarga de datos
    setDevices(devicesSample);
  };

  const handleDissociate = (deviceId) => {
    Alert.alert(
      "Desasociar Dispositivo",
      "¿Estás seguro de que quieres desasociar este dispositivo?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Desasociar",
          onPress: async () => {
            setSelectedDevice(deviceId); // Guarda el dispositivo actual seleccionado
            const response = await dissociateDevice(deviceId); // Llama a la función para desasociar el dispositivo
            if (response.ok) {
              loadData(); // Recarga los dispositivos si la desasociación fue exitosa
            } else {
              Alert.alert("Error", response.message || "No se pudo desasociar el dispositivo");
            }
          },
          style: "destructive"
        },
      ],
    );
  };

  return (
    <>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <View style={styles.container}>
        <FlatList
          data={devices}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <View style={styles.deviceListItem}>
              <Text style={styles.deviceText}>{item.room}</Text>
              <TouchableOpacity onPress={() => handleDissociate(item._id)}>
                <MaterialIcons name="delete" size={18} />
              </TouchableOpacity>
            </View>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.userListContainer}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  deviceListItem: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  deviceText: {
    fontSize: 16,
    color: '#333',
    flex: 1, // Asegura que el texto se ajuste dentro del contenedor
    marginLeft: 10, // Añade un pequeño margen a la izquierda del texto
    fontWeight: '500',
  },
  iconButton: {
    padding: 8,
    borderRadius: 50,
    backgroundColor: '#f0f0f0', // Un ligero fondo para destacar el área táctil
    marginLeft: 10, // Espaciado entre iconos
  },
  icon: {
    marginLeft: 10,
  },
  userListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default DeviceList;
