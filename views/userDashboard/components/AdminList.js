// UserList.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import useDeviceManagement from '../hooks/useDeviceManagement'; // Importamos nuestro hook

const UserList = () => {
  const {
    admins,
    dissociateAdmin,
    isLoading,
    loadData,
  } = useDeviceManagement();

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
  

  const confirmRemoveAdmin = (adminEmail, adminId) => {
    Alert.alert(
      "Eliminar Usuario",
      `¿Estás seguro de que quieres eliminar a ${adminEmail}?`,
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          onPress: async () => {
            await dissociateAdmin(adminId);
            await loadData();
          },
          style: "destructive"
        }
      ],
      { cancelable: true }
    );
  };


  return (
    <>
      <FlatList
        data={admins}
        keyExtractor={(admins) => admins._id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userListItem}>
            {/* Contenido del item de usuario */}
            <Text style={styles.userListTextName}>{`${item.firstName} ${item.lastName}`}</Text>
            <Text style={styles.userListTextEmail}>{item.email}</Text>
            
            <TouchableOpacity onPress={() => confirmRemoveAdmin(item.email, item._id)}>
              <MaterialIcons name="delete" size={18} color="black" />
            </TouchableOpacity>
          </View>
        )}
        // Otras propiedades del FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.userListContainer}
      />
    </>
  );
};

export default UserList;
