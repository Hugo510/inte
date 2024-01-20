import React from 'react';
import {View, TextInput, ImageBackground, TouchableOpacity, Text } from 'react-native';
import styles from './homeScreen.styles';

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={require('../../assets/images/background.jpg')} // Replace with your local image
        style={styles.backgroundImage}
      >
        <View style={styles.header}>
          <Text style={styles.brand}>UNBOX</Text>
          <View style={styles.nav}>
            <Text style={styles.navItem}>Home</Text>
            <Text style={styles.navItem}>Services</Text>
            <Text style={styles.navItem}>About</Text>
            <Text style={styles.navItem}>Contact</Text>
            <Text style={styles.navItem}>Support</Text>
            <Text style={styles.navItem}>Sign In / Sign Up</Text>
          </View>
        </View>
        
        <View style={styles.searchSection}>
          <TextInput
            style={styles.searchInput}
            placeholder="Enter Destinations"
            placeholderTextColor="#666"
          />
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Press</Text>
        <Text style={styles.footerText}>Cookies</Text>
        <Text style={styles.footerText}>Privacy</Text>
        <Text style={styles.footerText}>Contact Us</Text>
        <Text style={styles.footerText}>Copyrights</Text>
      </View>

      <View style={styles.newsletterSection}>
        <TextInput
          style={styles.newsletterInput}
          placeholder="email address"
          placeholderTextColor="#666"
        />
        <TouchableOpacity style={styles.subscribeButton}>
          <Text style={styles.subscribeButtonText}>Subscribe</Text>
        </TouchableOpacity>
      </View>
      
    </SafeAreaView>
  );
};


export default HomeScreen;
