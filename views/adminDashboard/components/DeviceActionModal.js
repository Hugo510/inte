// DeviceActionModal.js
import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Button, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import { Checkbox } from 'react-native-paper';
import useDeviceManagement from '../hooks/useDeviceManagement';

// Imagina que este componente toma algunas props como isOpen, onClose, device, y una para manejar las asignaciones y desasignaciones.
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
    shadowRadius: 3.84,
    elevation: 5,
  },
  userListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  // Añade más estilos según sea necesario
});
  
  export default function DeviceActionModal({
    isVisible,
    onClose,
    device,
    users,
  }) {
    // Uso correcto del hook dentro de un componente funcional
    const { assignDeviceToUser, unassignDeviceFromUser, loadData } = useDeviceManagement();

  
    // Estado para manejar los usuarios seleccionados
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [localDeviceData, setLocalDeviceData] = useState({ room: device?.room || '' });
  
    useEffect(() => {
      // Actualiza el estado cuando el dispositivo cambia
      setSelectedUsers(device?.assignedUsers || []);
    }, [device]);
  
    const handleToggleUser = async (userId) => {
      if (selectedUsers.includes(userId)) {
        await unassignDeviceFromUser(device._id, userId);
      } else {
        await assignDeviceToUser(device._id, userId);
      }
      await loadData();
      setSelectedUsers((prev) =>
        prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
      );
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
          <TextInput
            value={localDeviceData.room}
            onChangeText={(text) => setLocalDeviceData({...localDeviceData, room: text})}
            // Otros campos de texto según sea necesario
          />
          <ScrollView>
            {users.map((user) => (
              <View key={user._id} style={styles.userListItem}>
                <Text>{`${user.firstName} ${user.lastName}`}</Text>
                <Checkbox
                  status={selectedUsers.includes(user._id) ? 'checked' : 'unchecked'}
                  onPress={() => handleToggleUser(user._id)}
                />
              </View>
            ))}
          </ScrollView>
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}
