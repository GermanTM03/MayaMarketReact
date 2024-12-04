import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Welcome from '../screens/Welcome';
import Login from '../screens/sesion/Login';
import Register from '../screens/sesion/Register';
import BottomTabs from '../../components/visual/ButtomTabs'; // Aquí estará el Bottom Navigation

import AlmacenScreen from '../screens/administracion/AlmacenScreen';
import AyudaScreen from '../screens/more//AyudaScreen';
import MisProductosScreen from '../screens/more/MisProductosScreen';
import MisQrScreen from '../screens/more//MisQrScreen';
import VenderScreen from '../screens/more/VenderScreen';
import AdministracionScreen from '../screens/AdministracionScreen';
import Ordenes from '../screens/more/Ordenes';
import MapaScreen from '../screens/more/MapScreen';


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


      <Stack.Screen name="Administracion" component={AdministracionScreen}  />
      <Stack.Screen name="Ayuda" component={AyudaScreen} />
      <Stack.Screen name="Ordenes" component={Ordenes} />
      <Stack.Screen name="Mapa" component={MapaScreen}    options={{ title: 'Punto De Entrega' }}/>
      <Stack.Screen name="MisProductos" component={MisProductosScreen}  />
      <Stack.Screen name="MisQr" component={MisQrScreen}   options={{ title: 'Mis Pedidos' }} 
 />
      <Stack.Screen name="Vender" component={VenderScreen} />
      
      <Stack.Screen name="Almacen" component={AlmacenScreen}  options={{ headerShown: false }} />
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
