// app.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './router/AppNavigator';
import { loadFonts } from './styles/fonts';
import { View, Text, ActivityIndicator } from 'react-native'; // Importa ActivityIndicator para el indicador de carga

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    // Carga las fuentes y actualiza el estado cuando se complete la carga
    loadFonts().then(() => setFontsLoaded(true)).catch(err => console.log(err));
  }, []);

  // Si las fuentes aún no se han cargado, muestra un indicador de carga
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Una vez las fuentes están cargadas, muestra la navegación
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};

export default App;
