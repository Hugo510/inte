import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { Feather, FontAwesome, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from './profileScreen.styles';

const ProfileMonitorScreen = ({ navigation }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfileData = async () => {
            setLoading(true);
            const userToken = await AsyncStorage.getItem('userToken');
            const userId = await AsyncStorage.getItem('userId');
            if (!userToken || !userId) {
                Alert.alert("Authentication Error", "Authentication token or user ID not found.", [{ text: "Retry", onPress: () => fetchProfileData() }]);
                setLoading(false);
                return;
            }

            const endpoint = `http://${global.ipDireccion}:3000/api/admins/${userId}`;
            try {
                const response = await fetch(endpoint, {
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                    },
                });

                if (response.ok) {
                    const json = await response.json();
                    setUserData(json);
                } else {
                    const errorMessage = await response.text();
                    throw new Error(errorMessage || "Failed to fetch profile data.");
                }
            } catch (error) {
                Alert.alert("Fetch Error", error.message || "An unexpected error occurred while fetching profile data.", [{ text: "Retry", onPress: () => fetchProfileData() }]);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} />;
    }

    if (!userData) {
        return <View style={styles.centeredContent}><Text>No user data available.</Text></View>;
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <MaterialIcons name="arrow-back-ios" size={24} color="black" onPress={() => navigation.goBack()} />
                    <MaterialIcons name="more-horiz" size={24} color="black" onPress={() => { /* Open settings or similar */ }} />
                </View>
                <View style={styles.profileContainer}>
                    <Image source={require('../../assets/images/yo.jpg')} style={styles.profilePic} />
                    <Text style={styles.profileName}>{userData.name}</Text>
                    <TouchableOpacity style={styles.followButton} onPress={() => navigation.navigate('RequestMonitor')}>
                        <FontAwesome name="plus" size={14} color="white" />
                        <Text style={styles.followButtonText}>Manage Requests</Text>
                    </TouchableOpacity>
                    <Text style={styles.contactInfo}>{userData.age}</Text>
                    <Text style={styles.contactInfo}>{userData.email}</Text>
                </View>
                <View style={styles.statsContainer}>
                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>{userData.role}</Text>
                        <Text style={styles.statLabel}>Role</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>{userData.firstName} {userData.lastName}</Text>
                        <Text style={styles.statLabel}>Full Name</Text>
                    </View>
                </View>
                <View style={styles.balanceContainer}>
                    <Text style={styles.balanceAmount}>Admins #: {userData.monitoringRequests.length}</Text>
                    <Text style={styles.balanceOrders}>Pending: {userData.monitoringRequests.filter(request => request.status === 'pending').length}</Text>
                </View>
                <View style={styles.menuContainer}>
                    {/* Additional Menu Items Here */}
                </View>
                <TouchableOpacity
                    style={styles.logoutContainer}
                    onPress={async () => {
                        await AsyncStorage.removeItem('userToken');
                        navigation.navigate('LoginScreen'); // Assuming this is the route for your login screen
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

export default ProfileMonitorScreen;