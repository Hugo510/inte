import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { Feather, FontAwesome, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from './profileScreen.styles';
const ProfileScreenUser = ({ navigation }) => {

        const [userData, setUserData] = useState(null);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            const fetchProfileData = async () => {
                const userToken = await AsyncStorage.getItem('userToken');
                const userId = await AsyncStorage.getItem('userId');
                if (!userToken || !userId) {
                  Alert.alert("Error", "No se encontró el token de autenticación o el ID del usuario.");
                  setLoading(false);
                  return;
              }
        
              const endpoint = `http://${global.ipDireccion}:3000/api/users/${userId}`;

              try {
                const response = await fetch(endpoint, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${userToken}`, 
                    },
                });

                if (response.ok) {
                    const json = await response.json();
                    setUserData(json);
                } else {
                    const errorMessage = await response.text();
                    throw new Error(errorMessage || "Error al obtener datos del perfil.");
                }
            } catch (error) {
                Alert.alert("Error", error.message || "Ocurrió un error inesperado.");
            } finally {
                setLoading(false);
            }
        };

            fetchProfileData();
        }, []);

        if (loading) {
            return <ActivityIndicator />;
        }

        if (!userData) {
            return <Text>No se pudo obtener los datos del usuario.</Text>; // Manejo de estado sin datos
        }
    
      return (
        <SafeAreaView style={styles.container}>
          <ScrollView>
            <View style={styles.header}>
              <MaterialIcons name="arrow-back-ios" size={24} color="black" />
              <MaterialIcons name="more-horiz" size={24} color="black" />
            </View>
            <View style={styles.profileContainer}>
              <Image source={require('../../assets/images/yo.jpg' )} style={styles.profilePic} />
              <Text style={styles.profileName}>{userData.name}</Text>
              <TouchableOpacity style={styles.followButton} onPress={() => navigation.navigate('Graphic')}>
                <FontAwesome name="plus" size={14} color="white" />
                <Text style={styles.followButtonText}>Añadir Dispositivo</Text>
              </TouchableOpacity>
              <Text style={styles.contactInfo}>{userData.age}</Text>
              <Text style={styles.contactInfo}>{userData.email}</Text>
            </View>
            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{userData.role}</Text>
                <Text style={styles.statLabel}>Rol</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{userData.firstName} {userData.lastName}</Text>
                <Text style={styles.statLabel}>Usuario</Text>
              </View>
            </View>
            <View style={styles.balanceContainer}>
              <Text style={styles.balanceAmount}>Monitores #: {userData.monitoringRequests.length}</Text>
              <Text style={styles.balanceOrders}>Pendientes: {userData.monitoringRequests.filter(request => request.status === 'pending').length}</Text>
            </View>
            <View style={styles.menuContainer}>
              <MenuItem
                icon="heart"
                text="Graficas"
                onPress={() => navigation.navigate('Graphic')}
              />
              <MenuItem
                icon="gift"
                text="Cards"
                onPress={() => navigation.navigate('Cards')}
              />
              <MenuItem
                icon="edit"
                text="Editar Perfil"
                onPress={() => navigation.navigate('EditProfile')}
              />
              <MenuItem
                icon="star"
                text="Gestionar administradores"
                onPress={() => navigation.navigate('AdminDashboard')}
              />
              <MenuItem
                icon="send"
                text="Solicitudes"
                onPress={() => navigation.navigate('Request')}
              />
            </View>
            <TouchableOpacity
              style={styles.logoutContainer}
              onPress={async () => {
                await AsyncStorage.removeItem('userToken');
                navigation.navigate('HomeStack'); 
              }}
            >
              <MaterialIcons name="logout" size={24} color="red" />
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>

          </ScrollView>
        </SafeAreaView>
      );
    };
    
    const MenuItem = ({ icon, text, onPress }) => (
      <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <FontAwesome name={icon} size={24} color="black" />
        <Text style={styles.menuText}>{text}</Text>
      </TouchableOpacity>
    );    

export default ProfileScreenUser;