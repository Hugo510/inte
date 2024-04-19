import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import useDeviceManagement from '../hooks/useDeviceManagement'; // Importamos nuestro hook

const UserList = () => {
  /* const {
    admins,
    dissociateAdmin,
    isLoading,
    error, // Importamos también el estado de error para mostrarlo
    loadData,
  } = useDeviceManagement(); */

  const [admins, setAdmins] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulando la carga de datos
    setAdmins(adminsSample);  // Aquí utilizas el arreglo de muestra
    setError(null);
  }, []);

  const dissociateAdmin = async (adminId) => {
    // Aquí deberías implementar la lógica para desasociar un administrador
    console.log('Dissociating admin with ID:', adminId);
    // Simulando éxito o error en la operación
    const isSuccess = true; // Cambiar a false para simular un error
    if (!isSuccess) {
      setError('No se pudo eliminar al administrador. Intente nuevamente.');
    }
  };

  const loadData = async () => {
    // Simular recarga de datos
    setAdmins(adminsSample);
  };


  const adminsSample = [
    {
      _id: '1',
      firstName: 'Ana',
      lastName: 'Martínez',
      email: 'ana.martinez@example.com',
    },
    {
      _id: '2',
      firstName: 'Juan',
      lastName: 'García',
      email: 'juan.garcia@example.com',
    },
    {
      _id: '3',
      firstName: 'Luisa',
      lastName: 'Pérez',
      email: 'luisa.perez@example.com',
    },
    {
      _id: '4',
      firstName: 'Carlos',
      lastName: 'Dominguez',
      email: 'carlos.dominguez@example.com',
    },
  ];
  

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
    errorText: {
      color: 'red',
      textAlign: 'center',
      marginTop: 10,
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
            if (error) {
              Alert.alert("Error", error);
            } else {
              await loadData();
            }
          },
          style: "destructive"
        }
      ],
      { cancelable: true }
    );
  };

  return (
    <>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <FlatList
        data={admins}
        keyExtractor={(admins) => admins._id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userListItem}>
            <Text style={styles.userListTextName}>{`${item.firstName} ${item.lastName}`}</Text>
            <Text style={styles.userListTextEmail}>{item.email}</Text>
            
            <TouchableOpacity onPress={() => confirmRemoveAdmin(item.email, item._id)}>
              <MaterialIcons name="delete" size={18} color="black" />
            </TouchableOpacity>
          </View>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.userListContainer}
      />
    </>
  );
};

export default UserList;
