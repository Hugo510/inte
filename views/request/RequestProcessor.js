import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Alert, StyleSheet } from 'react-native';


const RequestProcessor = ({ request, adminEmail, onUpdate, onDelete }) => {
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editedEmail, setEditedEmail] = useState(request.userEmail || '');

  const handleUpdate = () => {
    updateEmail(request.id, editedEmail);
    setEditModalVisible(false);
  };
  

  const handleDelete = () => {
    deleteRequest(request.id);
    setDeleteModalVisible(false);
  };
  

  const updateEmail = async (requestId, newEmail) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken'); // Asume que el token del usuario está almacenado
      const endpoint = `http://${global.ipDireccion}:3000/api/admins/monitoring-requests/${requestId}/resend`;
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newEmail }),
      });
      if (!response.ok) {
        throw new Error('No se pudo actualizar la solicitud');
      }
      // Asumiendo que quieres actualizar la lista de solicitudes tras la actualización
      onUpdate(); // Llama a la función pasada como prop para actualizar la lista de solicitudes
      Alert.alert('Éxito', 'La solicitud se actualizó correctamente');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };
  
  const deleteRequest = async (requestId) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken'); // Asume que el token del usuario está almacenado
      const endpoint = `http://${global.ipDireccion}:3000/api/admins/monitoring-requests/${requestId}`;
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('No se pudo eliminar la solicitud');
      }
      // Asumiendo que quieres actualizar la lista de solicitudes tras la eliminación
      onDelete();
      Alert.alert('Éxito', 'La solicitud se eliminó correctamente');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };
  

  return (
    <View style={styles.requestItem}>
      <Text>Solicitud de: {adminEmail}</Text>
      <Text>Estado: {request.status}</Text>
      <Text>Enviada el: {new Date(request.sentAt).toLocaleDateString()}</Text>
      
      <TouchableOpacity onPress={() => setEditModalVisible(true)} style={styles.editButton}>
        <Text>Editar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setDeleteModalVisible(true)} style={styles.deleteButton}>
        <Text>Eliminar</Text>
      </TouchableOpacity>

      {/* Modal para editar */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalView}>
          <TextInput
            style={styles.modalTextInput}
            onChangeText={setEditedEmail}
            value={editedEmail}
            placeholder="Nuevo email"
            keyboardType="email-address"
          />
          <TouchableOpacity onPress={handleUpdate} style={styles.modalButton}>
            <Text>Actualizar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Modal para eliminar */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isDeleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text>¿Estás seguro de que quieres eliminar esta solicitud?</Text>
          <TouchableOpacity onPress={handleDelete} style={styles.modalButton}>
            <Text>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
    requestItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    editButton: {
      // Estilos para el botón de editar
    },
    deleteButton: {
      // Estilos para el botón de eliminar
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
    modalTextInput: {
      // Estilos para el campo de texto del modal
    },
    modalButton: {
      // Estilos para el botón del modal
    },
  });


  /* const styles = StyleSheet.create({
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
}); */

export default RequestProcessor;
