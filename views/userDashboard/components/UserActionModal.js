// UserActionModal.js
import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { Checkbox } from 'react-native-paper';
import useDeviceManagement from '../hooks/useDeviceManagement';

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  userListItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 250, // Ajusta este valor según el tamaño de tu pantalla
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
  },
  deviceText: {
    fontSize: 16,
    flexShrink: 1, // Asegura que el texto se ajuste dentro del contenedor
  },
  buttonClose: {
    backgroundColor: "#2196F3",
    padding: 10,
    marginTop: 20,
    borderRadius: 20,
    width: 100, // Ajusta el ancho del botón cerrar según prefieras
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
  },
  scrollViewContainer: {
    maxHeight: 400, // Ajusta la altura máxima del ScrollView según prefieras
  },
});



export default function UserActionModal({ isVisible, onClose, user }) {
  const { devices, assignDeviceToUser, unassignDeviceFromUser, loadData } = useDeviceManagement();
  const [assignedDevices, setAssignedDevices] = useState([]);

  useEffect(() => {
    // Suponiendo que `user` tiene una propiedad `assignedDevices` que es una lista de IDs
    setAssignedDevices(user.assignedDevices || []);
  }, [user]);

  const handleToggleDeviceAssignment = async (deviceId) => {
    if (assignedDevices.includes(deviceId)) {
      await unassignDeviceFromUser(deviceId, user._id);
    } else {
      await assignDeviceToUser(deviceId, user._id);
    }
    loadData();
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ScrollView>
            {devices.map((device) => (
              <View key={device._id} style={styles.userListItem}>
                <Text>{device.room}</Text>
                <Checkbox
                  status={assignedDevices.includes(device._id) ? 'checked' : 'unchecked'}
                  onPress={() => handleToggleDeviceAssignment(device._id)}
                />
              </View>
            ))}
          </ScrollView>
          <Button title="Cerrar" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}
