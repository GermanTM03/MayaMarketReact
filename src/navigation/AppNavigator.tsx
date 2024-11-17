import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Welcome from '../screens/Welcome';
import Login from '../screens/sesion/Login';
import Register from '../screens/sesion/Register';
import BottomTabs from '../../components/visual/ButtomTabs'; // Aquí estará el Bottom Navigation

const Stack = createStackNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#272C73', // Color del encabezado
        },
        headerTintColor: '#FFFFFF', // Color del texto en el encabezado
        headerTitleStyle: {
          fontWeight: 'bold', // Opcional: hacer que el título sea negrita
        },
      }}
    >
      <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={BottomTabs} options={{ headerShown: false }} />
      
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerTitle: '', // Oculta el título del encabezado
        }}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{
          headerTitle: '', // Oculta el título del encabezado
        }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
