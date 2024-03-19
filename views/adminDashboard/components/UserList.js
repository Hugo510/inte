// UserList.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import UserActionModal from './UserActionModal'; // Asumiendo que este modal ya está creado
import useDeviceManagement from '../hooks/useDeviceManagement'; // Importamos nuestro hook

const UserList = () => {
  const {
    users,
    removeUser,
    isLoading,
    loadData,
    assignDeviceToUser,
    unassignDeviceFromUser,
  } = useDeviceManagement();

  const [userActionModalVisible, setUserActionModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Estilos aquí o en un archivo externo importado
  const styles = StyleSheet.create({
    userListItem: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 15,
      marginVertical: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3,
    },
    userListTextName: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    userListTextEmail: {
      fontSize: 14,
      color: '#666',
      marginTop: 2,
    },
    userListContainer: {
      flexGrow: 1,
      justifyContent: 'center',
    },
  });
  

  const confirmRemoveUser = (userEmail) => {
    Alert.alert(
      "Eliminar Usuario",
      `¿Estás seguro de que quieres eliminar a ${userEmail}?`,
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          onPress: async () => {
            await removeUser(userEmail);
            await loadData(); // Recargamos la información
          },
          style: "destructive"
        }
      ],
      { cancelable: true }
    );
  };

  const openUserActionModal = (user) => {
    setSelectedUser(user);
    setUserActionModalVisible(true);
  };

  const handleAssignDevices = async (deviceId, userId) => {
    await assignDeviceToUser(deviceId, userId);
    await loadData(); // Recargamos los datos después de la asignación
  };

  const handleUnassignDevices = async (deviceId, userId) => {
    await unassignDeviceFromUser(deviceId, userId);
    await loadData(); // Recargamos los datos después de la desasignación
  };

  return (
    <>
      <FlatList
        data={users}
        keyExtractor={(user) => user._id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userListItem}>
            {/* Contenido del item de usuario */}
            <Text style={styles.userListTextName}>{`${item.firstName} ${item.lastName}`}</Text>
            <Text style={styles.userListTextEmail}>{item.email}</Text>
            
            <TouchableOpacity onPress={() => confirmRemoveUser(item.email)}>
              <MaterialIcons name="delete" size={18} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openUserActionModal(item)}>
              <MaterialIcons name="settings" size={18} color="black" />
            </TouchableOpacity>
          </View>
        )}
        // Otras propiedades del FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.userListContainer}
      />
      {selectedUser && (
        <UserActionModal
          isVisible={userActionModalVisible}
          onClose={() => setUserActionModalVisible(false)}
          user={selectedUser}
          onAssignDevices={handleAssignDevices}
          onUnassignDevices={handleUnassignDevices}
        />
      )}
    </>
  );
};

export default UserList;
