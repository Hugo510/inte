// app.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './router/AppNavigator';
import { loadFonts } from './styles/fonts';
import { View, ActivityIndicator, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
//import firebase from './firebaseConfig'; // Importa la configuración de Firebase

global.ipDireccion = '192.168.1.2';

// Llama a la función de Cloud Functions
/* const callSendPushNotification = async (data) => {
  try {
    const sendPushNotificationFunction = firebase.functions().httpsCallable('sendPushNotification');
    const response = await sendPushNotificationFunction({ data });
    console.log(response);
  } catch (error) {
    console.error("Error al llamar a la función sendPushNotification:", error);
  }
};
 */
const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    // Registra para notificaciones push

    // Carga las fuentes y actualiza el estado cuando se complete la carga
    loadFonts().then(() => setFontsLoaded(true)).catch(err => console.log(err));

    registerForPushNotificationsAsync();

    // Escuchas para notificaciones recibidas mientras la app está abierta
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log(notification);
    });

    // Escuchas para respuestas a notificaciones (usuario interactuó con la notificación)
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    // Asegúrate de remover los listeners al desmontar el componente
    return () => {
      Notifications.removeNotificationSubscription(subscription);
      Notifications.removeNotificationSubscription(responseSubscription);
    };
  }, []);

  async function registerForPushNotificationsAsync() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
    // Aquí puedes enviar el `token` a tu servidor si es necesario
  }
  

  // Si las fuentes aún no se han cargado o el usuario no se ha autenticado, muestra un indicador de carga
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Una vez las fuentes están cargadas y el usuario está autenticado, muestra la navegación
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};

export default App;
