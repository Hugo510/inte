import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RequestProcessor = ({ request, adminEmail, onUpdate, onDelete }) => {
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editedEmail, setEditedEmail] = useState(request.userEmail || '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const updated = await updateEmail(request.id, editedEmail);
      if (updated) {
        Alert.alert('Éxito', 'La solicitud se actualizó correctamente');
        onUpdate();
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
      setEditModalVisible(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert('Confirmación', '¿Estás seguro de que quieres eliminar esta solicitud?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', onPress: async () => {
        setLoading(true);
        try {
          const deleted = await deleteRequest(request.id);
          if (deleted) {
            Alert.alert('Éxito', 'La solicitud se eliminó correctamente');
            onDelete();
          }
        } catch (error) {
          Alert.alert('Error', error.message);
        } finally {
          setLoading(false);
          setDeleteModalVisible(false);
        }
      }}
    ]);
  };

  return (
    <View style={styles.requestItem}>
      <Text>Solicitud de: {adminEmail}</Text>
      <Text>Estado: {request.status}</Text>
      <Text>Enviada el: {new Date(request.sentAt).toLocaleDateString()}</Text>
      {loading && <ActivityIndicator size="small" color="#0000ff" />}
      <TouchableOpacity onPress={() => setEditModalVisible(true)} style={styles.editButton}>
        <Text>Editar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setDeleteModalVisible(true)} style={styles.deleteButton}>
        <Text>Eliminar</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditModalVisible}
        onRequestClose={() => setEditModalVisible(false)}>
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={isDeleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}>
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
        backgroundColor: '#4CAF50', // Green
        padding: 10,
        margin: 10,
    },
    deleteButton: {
        backgroundColor: '#f44336', // Red
        padding: 10,
        margin: 10,
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
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        width: 200,
        paddingHorizontal: 10,
    },
    modalButton: {
        backgroundColor: '#2196F3', // Blue
        padding: 10,
        margin: 10,
    },
});

export default RequestProcessor;
