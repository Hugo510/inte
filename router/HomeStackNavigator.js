import { createNativeStackNavigator } from '@react-navigation/native-stack';
//import HomeScreen from '../views/homeScreen/homeScreen';
import HomeScreenNo from '../views/homeScreen/homeScreenNo';

const Stack = createNativeStackNavigator();

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      {/* <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/> */}
      <Stack.Screen name="HomeNo" component={HomeScreenNo} options={{ headerShown: false }}/>
      {/* Agrega más si es necesario */}
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;
