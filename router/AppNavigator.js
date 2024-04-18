import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeStackNavigator from './HomeStackNavigator';
import LoginScreen from '../views/LoginScreenV/LoginScreen';
import RegisterScreen from '../views/registerScreen/RegisterScreen';
import MQTTComponent from '../views/comunication/comunicationScreen';
import CardsScreen from '../views/cards/cardsScreen';
import EditParametersScreen from '../views/editParameters/editParametersScreen';
import ProfileScreen from '../views/profile/profileScreen';
import ProfileScreenUser from '../views/profileUser/profileScreen';
import GraphicScreen from '../views/graphics/graphicsScreen';
/* import Wallet from '../views/graphAd/sensorDataScreen.tsx'; */
import RequestsScreen from '../views/request/requesScreen';
import AdminDashboardScreen from '../views/adminDashboard/adminDashboardScreen';
import EditProfileScreen from '../views/editProfile/editProfileScreen';
import AddDeviceScreen from '../views/addDevice/addDeviceScreen';

/* ********************************* */
import ProfileMonitorScreen from '../views/profileMonitor/profileScreen';
import RequestsMonitorScreen from '../views/requestMonitor/requesScreen';
import UserDashboardScreen from '../views/userDashboard/userDashboardScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {

  return (
    
      <Stack.Navigator initialRouteName="HomeStack">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="HomeStack" component={HomeStackNavigator} options={{ headerShown: false }}/>
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Api" component={MQTTComponent} options={{ headerShown: false }}/>
        <Stack.Screen name="Cards" component={CardsScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="EditParameters" component={EditParametersScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="ProfileUser" component={ProfileScreenUser} options={{ headerShown: false }}/>
        <Stack.Screen name="Graphic" component={GraphicScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Request" component={RequestsScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="AddDevice" component={AddDeviceScreen} options={{ headerShown: false }}/>
        {/* *********************************************************************************** */}
        <Stack.Screen name="ProfileMonitor" component={ProfileMonitorScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="RequestMonitor" component={RequestsMonitorScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="UserDashboard" component={UserDashboardScreen} options={{ headerShown: false }}/>
        {/* Agrega aquí más pantallas si es necesario */}
      </Stack.Navigator>
  );/* EditProfileScreen */
};

export default AppNavigator;
