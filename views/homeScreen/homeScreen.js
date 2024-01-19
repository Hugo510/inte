import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './homeScreen.styles';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.logo}>I</Text>
        <View style={styles.navBar}>
          <Text style={styles.navItem}>Features</Text>
          <Text style={styles.navItem}>About</Text>
          <Text style={styles.navItem}>Contact Us</Text>
          <TouchableOpacity style={styles.tryFreeButton}>
            <Text style={styles.tryFreeText}>Nosotros</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Main Content Section */}
      <ScrollView style={styles.mainContent}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Easy Way to Manage Your Accounting Software</Text>
          <Text style={styles.heroSubtitle}>Accounting is built into all small businesses' operations...</Text>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.getStartedButton}>
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.demoButton}>
              <Text style={styles.buttonText}>Free Demo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Feature Cards Section */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featureCardsContainer}>
          {/* Feature Card Example */}
          <View style={styles.featureCard}>
            <Icon name="analytics" size={24} color={styles.iconColor} />
            <Text style={styles.featureCardTitle}>Analytics</Text>
            <Text style={styles.featureCardText}>Track and analyze your data...</Text>
          </View>
          {/* Add more feature cards */}
        </ScrollView>

        {/* Brands Section */}
        <View style={styles.brandsSection}>
          {/* Brand Logos */}
          {/* ... */}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2024 Qualytics. All rights reserved.</Text>
          {/* Aquí se pueden añadir más elementos al footer si es necesario */}
        </View>
      
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
