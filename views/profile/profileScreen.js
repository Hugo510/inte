import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { Feather, FontAwesome, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from './profileScreen.styles';
const ProfileScreen = () => {

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
        
              const endpoint = `http://192.168.1.30:3000/api/admins/${userId}`; // Construye el endpoint con el userId

              try {
                const response = await fetch(endpoint, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${userToken}`, // Asumiendo un esquema de autenticación Bearer
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
            return <ActivityIndicator />; // Muestra un indicador de carga mientras se obtienen los datos
        }

        if (!userData) {
            return <Text>No se pudo obtener los datos del usuario.</Text>; // Manejo de estado sin datos
        }

    /* const userData = {
        name: 'EMMA',
        designsPosted: 104,
        boardsCreated: 12,
        balance: 2084,
        orders: 14,
        phoneNumber: '(581) 305-6789',
        email: 'emma.terrain@gmail.com',
      }; */
    
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
              <TouchableOpacity style={styles.followButton}>
                <FontAwesome name="plus" size={14} color="white" />
                <Text style={styles.followButtonText}>Añadir Monitor</Text>
              </TouchableOpacity>
              <Text style={styles.contactInfo}>{userData.age}</Text>
              <Text style={styles.contactInfo}>{userData.email}</Text>
            </View>
            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{userData.role}</Text>
                <Text style={styles.statLabel}>Design posted</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{userData.email}</Text>
                <Text style={styles.statLabel}>Board created</Text>
              </View>
            </View>
            <View style={styles.balanceContainer}>
              <Text style={styles.balanceAmount}>${userData.monitoredUsers}</Text>
              <Text style={styles.balanceOrders}>{userData.monitoredUsers} Orders</Text>
            </View>
            <View style={styles.menuContainer}>
              <MenuItem icon="heart" text="Your Favorites" />
              <MenuItem icon="credit-card" text="Payment" />
              <MenuItem icon="gift" text="Referral Code" />
              <MenuItem icon="tag" text="Promotions" />
              <MenuItem icon="cog" text="Settings" />
            </View>
            <TouchableOpacity style={styles.logoutContainer}>
              <MaterialIcons name="logout" size={24} color="red" />
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      );
    };
    
    const MenuItem = ({ icon, text }) => (
      <TouchableOpacity style={styles.menuItem}>
        <FontAwesome name={icon} size={24} color="black" />
        <Text style={styles.menuText}>{text}</Text>
      </TouchableOpacity>
    );

export default ProfileScreen;