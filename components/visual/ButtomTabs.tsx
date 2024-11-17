import React, { useState } from 'react';
import { BottomNavigation } from 'react-native-paper';
import Home from '../../src/screens/Home'; // Asegúrate de que las rutas sean correctas
import Orders from '../../src/screens/tabs/Orders';
import Cart from '../../src/screens/tabs/Cart';
import Profile from '../../src/screens/tabs/Profile';

const BottomTabs = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'home', title: 'Inicio', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
    { key: 'orders', title: 'Mis Órdenes', focusedIcon: 'clipboard-list', unfocusedIcon: 'clipboard-list-outline' },
    { key: 'cart', title: 'Carrito', focusedIcon: 'cart', unfocusedIcon: 'cart-outline' },
    { key: 'profile', title: 'Perfil', focusedIcon: 'account', unfocusedIcon: 'account-outline' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: Home,
    orders: Orders,
    cart: Cart,
    profile: Profile,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      barStyle={{
        backgroundColor: '#ffffff',
        borderTopWidth: 4,
        borderTopColor: '#e0e0e0',
      }}
      activeColor="#272C73" // Color de íconos activos
      inactiveColor="#6e6e6e" // Color de íconos inactivos
      shifting={false} // Mantener etiquetas visibles en todos los íconos
    />
  );
};

export default BottomTabs;
