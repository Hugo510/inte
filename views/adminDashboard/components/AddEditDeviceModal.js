// DeviceActionModal.js
import React, { useState } from 'react';
import { Modal, View, Text, Button, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import { Checkbox } from 'react-native-paper';

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  userListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // Añade más estilos según sea necesario
  },
  // Más estilos según sea necesario
});


// Imagina que este componente toma algunas props como isOpen, onClose, device, y una para manejar las asignaciones y desasignaciones.
export default function DeviceActionModal({ isOpen, onClose, device, onSubmit, users, toggleUserAssignment }) {
  const [localDeviceData, setLocalDeviceData] = useState(device); // Local state para editar la información del dispositivo

  const handleToggleUser = (userId) => {
    // Actualiza la asignación/desasignación de usuarios al dispositivo
    toggleUserAssignment(userId, device._id);
  };

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TextInput
            value={localDeviceData.room}
            onChangeText={(text) => setLocalDeviceData({...localDeviceData, room: text})}
            // Otros campos de texto según sea necesario
          />
          <ScrollView>
            {users.map((user) => (
              <View key={user._id} style={styles.userListItem}>
                <Text>{`${user.firstName} ${user.lastName}`}</Text>
                <CheckBox
                  value={device.assignedUsers.includes(user._id)}
                  onValueChange={() => handleToggleUser(user._id)}
                />
              </View>
            ))}
          </ScrollView>
          <Button title="Submit Changes" onPress={() => onSubmit(localDeviceData)} />
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}
