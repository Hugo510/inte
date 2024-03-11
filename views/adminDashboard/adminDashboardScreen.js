import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, Alert, ActivityIndicator, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import { Checkbox } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather, FontAwesome, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import styles from './adminDashboardScreen.styles';


const AdminDashboardScreen = () => {
  // Estado inicial
  const [monitoringRequests, setMonitoringRequests] = useState([]);
  const [devices, setDevices] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [setSelectedDeviceIds , selectedDeviceIds ] = useState([]);
  const [deviceDetails, setDeviceDetails] = useState({ location: '' });

  const [userEmail, setUserEmail] = useState('');
  const [isRequestModalVisible, setIsRequestModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);



  const toggleUserSelection = (userId) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(userId)
        ? prevSelectedUsers.filter((id) => id !== userId)
        : [...prevSelectedUsers, userId]
    );
  };

    useEffect(() => {
        loadData();
      }, []);


    const loadData = async () => {
      /*         await fetchMonitoringRequests();
        await fetchDevices();
        await fetchUsers();
        await assignUserToDevice();
        await unassignUserFromDevice();
        await sendMonitoringRequest();
        await removeUser();
        await deleteDevice();
        await addDevice(); */
      try {
        setIsLoading(true);
        await Promise.all([fetchDevices(), fetchUsers(), fetchMonitoringRequests()]);
        // Cualquier otra operación necesaria posterior a la carga de datos
      } catch (error) {
        Alert.alert("Error de Carga", "Ocurrió un error al cargar los datos necesarios.");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchMonitoringRequests = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
      const adminId = await AsyncStorage.getItem('userId'); // Asegúrate de que guardas y recuperas el adminId correctamente
      try {
        const response = await axios.get(`http://${global.ipDireccion}:3000/api/admins/${adminId}/monitoring-requests`, {
          headers: { 'Authorization': `Bearer ${userToken}` },
        });
        if (response.status === 200) {
          setMonitoringRequests(response.data);
          console.log(response.data);
        } else {
          Alert.alert("Error", "No se pudo obtener las solicitudes de monitoreo.");
        }
      } catch (error) {
        Alert.alert("Error", error.message || "Ocurrió un error al obtener las solicitudes de monitoreo.");
      }
    };
    

    const fetchDevices = async () => {
      setIsLoading(true); // Asegúrate de iniciar el indicador de carga antes de la operación asíncrona
      const userToken = await AsyncStorage.getItem('userToken');
      const endpoint = `http://${global.ipDireccion}:3000/api/devices/byAdmin`;
      try {
        const response = await axios.get(endpoint, {
          headers: { 'Authorization': `Bearer ${userToken}` },
        });
    
        // Verifica explícitamente el estado de la respuesta
        if (response.status === 200 && response.data) {
          console.log(response.data)
          setDevices(response.data);
        } else {
          // Maneja otros códigos de estado HTTP adecuadamente
          Alert.alert("Error", "Respuesta inesperada del servidor.");
        }
      } catch (error) {
        // Maneja errores específicos (p. ej., de red)
        if (error.response) {
          // Respuestas fuera del rango 2xx caen aquí
          Alert.alert("Error", `Falló la obtención de dispositivos: ${error.response.status} ${error.response.data}`);
        } else if (error.request) {
          // La solicitud fue hecha pero no hubo respuesta
          Alert.alert("Error de red", "No se recibió respuesta del servidor.");
        } else {
          // Algo ocurrió al configurar la solicitud
          Alert.alert("Error", "Error al realizar la solicitud: " + error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    const fetchUsers = async () => {
      setIsLoading(true);
      const userToken = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('userId'); // Asegúrate de que 'userId' es guardado y recuperado correctamente
      try {
        const response = await axios.get(`http://${global.ipDireccion}:3000/api/admins/${userId}/users`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
    
        if (response.status === 200 && response.data) {
          console.log(response.data);
          setUsers(response.data);
        } else {
          Alert.alert("Error", "Respuesta inesperada del servidor al obtener usuarios.");
        }
      } catch (error) {
        if (error.response) {
          Alert.alert("Error", `Falló la obtención de usuarios: ${error.response.status} ${error.response.data}`);
        } else if (error.request) {
          Alert.alert("Error de red", "No se recibió respuesta del servidor al obtener usuarios.");
        } else {
          Alert.alert("Error", "Error al realizar la solicitud de usuarios: " + error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    const sendMonitoringRequest = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
      try {
        const response = await axios.post(`http://${global.ipDireccion}:3000/api/admins/sendMonitoringRequest/${userEmail}`, {
          userEmail,
        }, {
          headers: { 'Authorization': `Bearer ${userToken}` },
        });
        if (response.status === 200) {
          Alert.alert("Éxito", "Solicitud de monitoreo enviada exitosamente.");
          closeRequestModal(); // Cerrar el modal después de enviar la solicitud
          loadData(); // Opcional: recargar datos si es necesario
        } else {
          Alert.alert("Error", "No se pudo enviar la solicitud de monitoreo.");
        }
      } catch (error) {
        Alert.alert("Error", error.message || "Ocurrió un error al enviar la solicitud de monitoreo.");
      }
    };
    
  

  const assignUserToDevice = async (deviceId, userIds) => {
    const userToken = await AsyncStorage.getItem('userToken');
    try {
      const response = await axios.post(`http://${global.ipDireccion}:3000/api/devices/${deviceId}/assignUsers`, { userIds }, {
        headers: { 'Authorization': `Bearer ${userToken}` },
      });
      if (response.status === 200) {
        Alert.alert("Éxito", "Usuario(s) asignado(s) exitosamente al dispositivo.");
        loadData();
      } else {
        Alert.alert("Error", "No se pudo asignar el usuario al dispositivo.");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Ocurrió un error al asignar el usuario al dispositivo.");
    }
  };
  
  const unassignUserFromDevice = async (deviceId, userIds) => {
    const userToken = await AsyncStorage.getItem('userToken');
    try {
      const response = await axios.post(`http://${global.ipDireccion}:3000/api/devices/${deviceId}/unassignUsers`, { userIds }, {
        headers: { 'Authorization': `Bearer ${userToken}` },
      });
      if (response.status === 200) {
        Alert.alert("Éxito", "Usuario(s) desasignado(s) exitosamente del dispositivo.");
        loadData();
      } else {
        Alert.alert("Error", "No se pudo desasignar el usuario del dispositivo.");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Ocurrió un error al desasignar el usuario del dispositivo.");
    }
  };

  const removeUser = async (userEmail) => {
    const userToken = await AsyncStorage.getItem('userToken');
    try {
      const response = await axios.delete(`http://${global.ipDireccion}:3000/api/admin/removeUser/${userEmail}`, {
        headers: { 'Authorization': `Bearer ${userToken}` },
      });
      if (response.status === 200) {
        Alert.alert("Éxito", "Usuario eliminado exitosamente.");
        loadData(); // Recargar datos para reflejar los cambios
      } else {
        Alert.alert("Error", "No se pudo eliminar el usuario.");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Ocurrió un error al eliminar el usuario.");
    }
  };

  const deleteDevice = async (deviceId) => {
    const userToken = await AsyncStorage.getItem('userToken');
    try {
      const response = await axios.delete(`http://${global.ipDireccion}:3000/api/devices/${deviceId}`, {
        headers: { 'Authorization': `Bearer ${userToken}` },
      });
      if (response.status === 200) {
        Alert.alert("Éxito", "Dispositivo eliminado exitosamente.");
        loadData(); // Recargar datos para reflejar los cambios
      } else {
        Alert.alert("Error", "No se pudo eliminar el dispositivo.");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Ocurrió un error al eliminar el dispositivo.");
    }
  };

  const handleAddDevice = async (deviceDetails) => {
    const userToken = await AsyncStorage.getItem('userToken');
    try {
      const response = await axios.post(`http://${global.ipDireccion}:3000/api/devices`, deviceDetails, {
        headers: { 'Authorization': `Bearer ${userToken}` },
      });
      if (response.status === 201) {
        Alert.alert("Éxito", "Dispositivo añadido exitosamente.");
        loadData(); // Recargar datos para reflejar los cambios
        closeModal(); // Cierra el modal después de añadir
      } else {
        Alert.alert("Error", "No se pudo añadir el dispositivo.");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Ocurrió un error al añadir el dispositivo.");
    }
  };

  const handleUpdateDevice = async (deviceId, deviceDetails) => {
    // Actualización de un dispositivo existente
    const userToken = await AsyncStorage.getItem('userToken');
    try {
      const response = await axios.put(`http://${global.ipDireccion}:3000/api/devices/${deviceId}`, deviceDetails, {
        headers: { 'Authorization': `Bearer ${userToken}` }
      });
      if (response.status === 200) {
        Alert.alert("Éxito", "Dispositivo actualizado exitosamente.");
        loadData();
        closeModal();
      } else {
        Alert.alert("Error", "No se pudo actualizar el dispositivo.");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Ocurrió un error al actualizar el dispositivo.");
    }
  };

  const handleDeleteDevice = async (deviceId) => {
    // Eliminación de un dispositivo
    const userToken = await AsyncStorage.getItem('userToken');
    try {
      const response = await axios.delete(`http://${global.ipDireccion}:3000/api/admins/devices/${deviceId}`, {
        headers: { 'Authorization': `Bearer ${userToken}` }
      });
      if (response.status === 200) {
        Alert.alert("Éxito", "Dispositivo eliminado exitosamente.");
        loadData();
      } else {
        Alert.alert("Error", "No se pudo eliminar el dispositivo.");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Ocurrió un error al eliminar el dispositivo.");
    }
  };

  const assignUsersToSelectedDevice = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    try {
      await axios.post(
        `http://${global.ipDireccion}:3000/api/admins/devices/${selectedDevice._id}/assignUsers`,
        { userIds: selectedUsers },
        { headers: { 'Authorization': `Bearer ${userToken}` } }
      );
      Alert.alert("Usuarios asignados exitosamente");
      closeModal();
      loadData(); // Recargar la lista de dispositivos para reflejar los cambios
    } catch (error) {
      Alert.alert("Error al asignar usuarios", error.message || "Ocurrió un error al asignar usuarios.");
    }
  };

  const unaAssignUsersToSelectedDevice = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    try {
      await axios.post(
        `http://${global.ipDireccion}:3000/api/admins/devices/${selectedDevice._id}/unassignUsers`,
        { userIds: selectedUsers },
        { headers: { 'Authorization': `Bearer ${userToken}` } }
      );
      Alert.alert("Usuarios asignados exitosamente");
      closeModal();
      loadData(); // Recargar la lista de dispositivos para reflejar los cambios
    } catch (error) {
      Alert.alert("Error al asignar usuarios", error.message || "Ocurrió un error al asignar usuarios.");
    }
  };

  const handleRemoveUser = async (userEmail) => {
    const userToken = await AsyncStorage.getItem('userToken');
    try {
      await axios.delete(`http://${global.ipDireccion}:3000/api/admins/removeUser/${userEmail}`, {
        headers: { 'Authorization': `Bearer ${userToken}` },
      });
      Alert.alert("Usuario eliminado exitosamente");
      loadData(); // Recargar la lista de usuarios para reflejar los cambios
    } catch (error) {
      Alert.alert("Error al eliminar usuario", error.message || "Ocurrió un error al eliminar el usuario.");
    }
  };

  const confirmDeleteDevice = (deviceId) => {
    Alert.alert(
      "Eliminar Dispositivo",
      "¿Estás seguro de que quieres eliminar este dispositivo?",
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Cancelado"),
          style: "cancel"
        },
        {
          text: "Eliminar",
          onPress: () => handleDeleteDevice(deviceId),
          style: "destructive"
        }
      ]
    );
  };
  
  const confirmRemoveUser = (userEmail) => {
    Alert.alert(
      "Eliminar Usuario",
      "¿Estás seguro de que quieres eliminar este usuario?",
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Cancelado"),
          style: "cancel"
        },
        {
          text: "Eliminar",
          onPress: () => handleRemoveUser(userEmail),
          style: "destructive"
        }
      ]
    );
  };
  

  const openModal = (type, item = null) => {
    setModalType(type);
  
    switch (type) {
      case 'editDevice':
        setSelectedDevice(item); // Configurar dispositivo para editar
        setDeviceDetails({ room: item.room }); // Asumiendo que `room` es un dato del dispositivo
        break;
      case 'assignUsers':
        setSelectedDevice(item); // Configurar dispositivo para asignar usuarios
        // Aquí, puedes preparar los datos necesarios para la asignación, si es necesario
        break;
      case 'editUser':
        setSelectedUser(item); // Configurar usuario para editar
        // Preparar IDs de dispositivos asignados para este usuario
        setSelectedDeviceIds(item.devices.map(device => device._id));
        break;
      // Añade más casos según sea necesario
    }
  
    setIsModalVisible(true);
  };


    const closeModal = () => {
    setIsModalVisible(false);
    setModalType('');
    setSelectedDevice(null);
    setDeviceDetails({ location: '' });
    setSelectedUsers([]);
  };

  const openRequestModal = () => {
    setIsRequestModalVisible(true);
  };
  
  const closeRequestModal = () => {
    setIsRequestModalVisible(false);
    setUserEmail(''); // Limpiar el estado después de cerrar el modal
  };
  

// Funciones adicionales para renderizar modales y manejar la asignación de usuarios
const renderAddEditDeviceModal = () => (
  <Modal animationType="slide" transparent={true} visible={isModalVisible && ['add', 'edit'].includes(modalType)} onRequestClose={closeModal}>
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <TextInput
          placeholder="Ubicación del Dispositivo"
          value={deviceDetails.location}
          onChangeText={(text) => setDeviceDetails({ ...deviceDetails, location: text })}
        />
        {modalType === 'add' && (
          <Button title="Añadir Dispositivo" onPress={handleAddDevice} />
        )}
        {modalType === 'edit' && (
          <Button title="Actualizar Dispositivo" onPress={() => handleUpdateDevice(selectedDevice._id, deviceDetails)} />
        )}
        <Button title="Cerrar" onPress={closeModal} />
      </View>
    </View>
  </Modal>
);

const renderAssignUsersModal = () => {
  
  return (
    <Modal animationType="slide" transparent={true} visible={isModalVisible} onRequestClose={closeModal}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ScrollView>
            {users.map((user) => (
              <View key={user._id} style={styles.userListItem}>
                <Text>{`${user.firstName} ${user.lastName}`}</Text>
                <Checkbox
                  status={selectedUsers.includes(user._id) ? 'checked' : 'unchecked'}
                  onPress={() => toggleUserSelection(user._id)}
                  color={'#6200ee'} // You can set the color like this
                />
              </View>
            ))}
          </ScrollView>
          <Button title="Asignar Seleccionados" onPress={assignUsersToSelectedDevice} />
          <Button title="Cerrar" onPress={closeModal} />
        </View>
      </View>
    </Modal>
  );
};

const toggleDeviceSelection = (deviceId) => {
  setSelectedDeviceIds((prevSelected) =>
    prevSelected.includes(deviceId)
      ? prevSelected.filter((id) => id !== deviceId)
      : [...prevSelected, deviceId]
  );
};

const renderEditUserModal = () => {
  // Asegúrate de que `selectedUser` y `selectedDeviceIds` estén definidos correctamente antes de usarlos
  return (
    <Modal animationType="slide" transparent={true} visible={isModalVisible && modalType === 'editUser'} onRequestClose={closeModal}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {/* Detalles del usuario y posiblemente edición de otros datos del usuario */}
          <ScrollView>
            {devices.map((device) => (
              <View key={device._id} style={styles.userListItem}>
                <Text>{device.room}</Text>
                <Checkbox
                  status={selectedDeviceIds.includes(device._id) ? 'checked' : 'unchecked'}
                  onPress={() => toggleDeviceSelection(device._id)}
                />
              </View>
            ))}
          </ScrollView>
          <Button title="Guardar Cambios" onPress={handleUpdateUserDevices} />
          <Button title="Cerrar" onPress={closeModal} />
        </View>
      </View>
    </Modal>
  );
};

const handleUpdateUserDevices = async () => {
  const originalAssignedDevices = selectedUser.devices.map(device => device._id);

  const devicesToAssign = selectedDeviceIds.filter(id => !originalAssignedDevices.includes(id));
  const devicesToUnassign = originalAssignedDevices.filter(id => !selectedDeviceIds.includes(id));

  // Llama a assignUserToDevice para cada dispositivo nuevo
  for (const deviceId of devicesToAssign) {
    await assignUserToDevice(deviceId, [selectedUser._id]);
  }

  // Llama a unassignUserFromDevice para cada dispositivo que necesita ser desasignado
  for (const deviceId of devicesToUnassign) {
    await unassignUserFromDevice(deviceId, [selectedUser._id]);
  }

  // Cierra el modal y actualiza la lista de usuarios/dispositivos
  closeModal();
  loadData(); // Asegúrate de que esta función actualiza la interfaz de usuario adecuadamente
};



const getUserDevices = (userId) => {
  // Filtra aquellos dispositivos que tengan al usuario actual en su array de monitoredUsers
  return devices
    .filter((device) => device.monitoredUsers.includes(userId))
    .map((device) => device.room) // Suponiendo que 'room' es la propiedad que quieres mostrar
    .join(', ');
};

// Implementación del botón para eliminar usuarios
const renderUserList = () => (
  <FlatList
    data={users}
    horizontal= {true}
    keyExtractor={(item) => item._id.toString()}
    renderItem={({ item }) => {
      // Obtener los dispositivos monitoreados por el usuario actual
      const userDevices = getUserDevices(item._id);

      return (
        <View style={styles.userListItem}>
          <Text style={styles.userListTextName}>{`${item.firstName} ${item.lastName}`}</Text>
          <Text style={styles.userListTextEmail}>{item.email}</Text>
          <Text style={styles.userListTextDevices}>{`Dispositivos: ${userDevices}`}</Text>
          <TouchableOpacity
            style={styles.editButton}
            
            onPress={() => openModal('editUser', item)}
            >
            <MaterialIcons name="edit" size={18} color="black" />
            <Text style={styles.userListButtonText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            
            onPress={() => confirmRemoveUser(item.email)}
          >
            <MaterialIcons name="delete" size={18} color="black" />
            <Text style={styles.userListButtonText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      );
    }}
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.userListContainer}
  />
);

const getMonitoredUsersNames = (monitoredUsersIds) => {
  // Filtrar y mapear los 'id' a nombres de usuarios.
  return monitoredUsersIds
    .map((userId) => {
      const user = users.find((user) => user._id === userId);
      return user ? `${user.email}` : 'Desconocido';
    })
    .join(', '); // Unir todos los nombres con una coma.
};

const renderDevicesList = () => (
  <FlatList
    data={devices}
    keyExtractor={(item) => item._id.toString()}
    horizontal={true}
    renderItem={({ item }) => {
      // Obtener los nombres de los usuarios para este dispositivo.
      const monitoredUsersNames = getMonitoredUsersNames(item.monitoredUsers);

      return (
        <View style={styles.deviceListItem}>
          <Text style={styles.deviceListTextRoom}>{item.room}</Text>
          <Text style={styles.deviceListTextUsers}>{`Usuarios: ${monitoredUsersNames}`}</Text>
          <View style={styles.deviceListButtonContainer}>
          <TouchableOpacity style={styles.editButton} onPress={() => openModal('editDevice', item)}>
            <MaterialIcons name="edit" size={18} color="black" />
            <Text style={styles.deviceListButtonText}>Editar</Text>
          </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDeleteDevice(item._id)}>
              <MaterialIcons name="delete" size={18} color="black" />
              <Text style={styles.deviceListButtonText}>Eliminar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deviceListButtonAssign} onPress={() => openModal('assignUsers', item)}>
              <MaterialIcons name="star" size={18} color="black" />
              <Text style={styles.deviceListButtonText}>Asignar</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }}
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.deviceListContainer}
  />
);

const renderMonitorRequest = () => (
  <FlatList
    data={monitoringRequests}
    keyExtractor={(item) => item._id.toString()}
    horizontal={true}
    renderItem={({ item }) => {
      // Aquí asumimos que quieres mostrar el email del usuario y el estado de la solicitud.
      const sentDate = new Date(item.sentAt);
      return (
        <View style={styles.listItem}>
          <Text style={styles.listItemText}>{`Usuario: ${item.userId.email}`}</Text>
          <Text style={styles.listItemText}>{`Estado: ${item.status}`}</Text>
          <Text style={styles.listItemText}>{`Enviado: ${sentDate.toLocaleDateString()}`}</Text>
          {/* Botones para editar y eliminar, suponiendo que estas acciones son relevantes */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.editButton} onPress={() => openModal('editRequest', item)}>
              <MaterialIcons name="edit" size={18} color="#FFF" />
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDeleteRequest(item._id)}>
              <MaterialIcons name="delete" size={18} color="#FFF" />
              <Text style={styles.buttonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }}
    showsHorizontalScrollIndicator={false}
  />
);

const renderRequest = () => (
  <Modal
      animationType="slide"
      transparent={true}
      visible={isRequestModalVisible}
      onRequestClose={closeRequestModal}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TextInput
            style={styles.textInput}
            placeholder="Correo electrónico del usuario"
            value={userEmail}
            onChangeText={setUserEmail}
          />
          <Button title="Enviar solicitud" onPress={sendMonitoringRequest} />
          <Button title="Cerrar" onPress={closeRequestModal} />
        </View>
      </View>
    </Modal>
);

  

if (isLoading) {
  return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" />
    </View>
  );
}

return (
  <View style={styles.container}>
    {isLoading ? (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    ) : (
      <>
        <Text style={styles.title}>Gestión de Dispositivos y Usuarios</Text>
        <Button title="Nueva solicitud de monitoreo" onPress={openRequestModal} />
        {renderAddEditDeviceModal()}
        {renderAssignUsersModal()}
        {renderDevicesList()}
        {renderUserList()}
        {renderEditUserModal()}
        {renderMonitorRequest()}
        {renderRequest()}

      </>
    )}
  </View>
);


  
};


export default AdminDashboardScreen;


/* <View style={styles.container}>
      <Text style={styles.title}>Gestión de Dispositivos y Usuarios</Text>
      {isLoading ? (
        <Text>Cargando...</Text>
      ) : (
        <>
      <FlatList
        data={devices}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>{`Dispositivo: ${item.name}`}</Text>
            <TouchableOpacity style={styles.button} onPress={() => openModal('assign', item)}>
              <Text style={styles.buttonText}>Asignar Usuarios</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => deleteDevice(item._id)}>
              <Text style={styles.buttonText}>Eliminar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => openModal('edit', item)}>
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => openModal('add')}>
        <Text style={styles.buttonText}>Añadir Dispositivo</Text>
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={isModalVisible} onRequestClose={closeModal}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {modalType === 'add' && (
              <>
                <TextInput placeholder="Nombre del Dispositivo" value={newDeviceName} onChangeText={setNewDeviceName} />
                <Button title="Añadir Dispositivo" onPress={addDevice} />
              </>
            )}
            
            <Button title="Cerrar" onPress={closeModal} />
          </View>
        </View>
      </Modal>


          <FlatList
            data={users}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Text style={styles.listItemText}>{`Usuario: ${item.firstName} ${item.lastName}`}</Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {}}>
                  <Text style={styles.buttonText}>Gestionar</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </>
      )}

<Text style={styles.title}>Solicitudes de Monitoreo</Text>
      <FlatList
        data={monitoringRequests}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text>{`Solicitud de: ${item.userName}`}</Text>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.button} onPress={() => handleAcceptRequest(item._id)}>
                <Text>Aceptar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleRejectRequest(item._id)}>
                <Text>Rechazar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
 */