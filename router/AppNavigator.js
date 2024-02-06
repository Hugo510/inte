import {
  createNativeStackNavigator,
  NavigationContainer,
} from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
// import AdminScreen from "../path/to/AdminScreen";
import { getUserRole } from "../utils/storage";
import CardsScreen from "../views/cards/cardsScreen";
import MQTTComponent from "../views/comunication/comunicationScreen";
import DashboardScreen from "../views/dashboard/dashboardScreen";
import LoginScreen from "../views/LoginScreenV/LoginScreen";
import RegisterScreen from "../views/registerScreen/RegisterScreen";
import HomeStackNavigator from "./HomeStackNavigator";
// import MonitorScreen from '../path/to/MonitorScreen';

//import ProfileScreen from '../views/profileScreen/ProfileScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      const role = await getUserRole(); // Asumiendo que esta función retorna el rol del usuario almacenado localmente
      setUserRole(role);
    };

    fetchUserRole();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeStack">
        {userRole === "admin" ? (
          <>
            <Stack.Screen name="AdminScreen" component={AdminScreen} />
            {/* Incluir aquí otras pantallas accesibles para admin */}
          </>
        ) : (
          <>
            {/* <Stack.Screen name="MonitorScreen" component={MonitorScreen} /> */}
            {/* Incluir aquí otras pantallas accesibles para monitores */}
          </>
        )}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeStack"
          component={HomeStackNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Api"
          component={MQTTComponent}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Cards"
          component={CardsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ headerShown: false }}
        />
        {/* Agrega aquí más pantallas si es necesario */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
