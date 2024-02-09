import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeStackNavigator from './HomeStackNavigator';
import LoginScreen from '../views/LoginScreenV/LoginScreen';
import RegisterScreen from '../views/registerScreen/RegisterScreen';
import MQTTComponent from '../views/comunication/comunicationScreen';
import CardsScreen from '../views/cards/cardsScreen';
import DashboardScreen from '../views/dashboard/dashboardScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {

  return (
    
      <Stack.Navigator initialRouteName="HomeStack">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="HomeStack" component={HomeStackNavigator} options={{ headerShown: false }}/>
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Api" component={MQTTComponent} options={{ headerShown: false }}/>
        <Stack.Screen name="Cards" component={CardsScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }}/>
        {/* Agrega aquí más pantallas si es necesario */}
      </Stack.Navigator>
  );
};

export default AppNavigator;
