import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeStackNavigator from './HomeStackNavigator';
import LoginScreen from '../views/LoginScreenV/LoginScreen';
import RegisterScreen from '../views/registerScreen/RegisterScreen';
//import ProfileScreen from '../views/profileScreen/ProfileScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="HomeStack" options={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="HomeStack" component={HomeStackNavigator} options={{ headerShown: false }}/>
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }}/>
      
      {/* Agrega aquí más pantallas si es necesario */}
    </Stack.Navigator>
  );
};

export default AppNavigator;
