import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeStackNavigator from './HomeStackNavigator';
import LoginScreen from '../views/LoginScreenV/LoginScreen';
import RegisterScreen from '../views/registerScreen/RegisterScreen';
import MQTTComponent from '../views/comunication/comunicationScreen';
import CardsScreen from '../views/cards/cardsScreen';
import DashboardScreen from '../views/dashboard/dashBoardScreen';
import ProfileScreen from '../views/profile/profileScreen';
import GraphicScreen from '../views/graphics/graphicsScreen';
/* import Wallet from '../views/graphAd/sensorDataScreen.tsx'; */
import RequestsScreen from '../views/request/requesScreen';
import AdminDashboardScreen from '../views/adminDashboard/adminDashboardScreen';


const Stack = createNativeStackNavigator();

const AppNavigator = () => {

  return (
    
      <Stack.Navigator initialRouteName="Dashboard">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="HomeStack" component={HomeStackNavigator} options={{ headerShown: false }}/>
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Api" component={MQTTComponent} options={{ headerShown: false }}/>
        <Stack.Screen name="Cards" component={CardsScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Graphic" component={GraphicScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Request" component={RequestsScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ headerShown: false }}/>
        {/* Agrega aquí más pantallas si es necesario */}
      </Stack.Navigator>
  );
};

export default AppNavigator;
