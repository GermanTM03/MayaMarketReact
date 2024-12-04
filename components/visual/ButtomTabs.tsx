import React, { useState, useRef } from 'react';
import { BottomNavigation } from 'react-native-paper';
import Home from '../../src/screens/Home';
import Busqueda from '../../src/screens/tabs/Busqueda';
import Cart from '../../src/screens/tabs/Cart';
import Profile from '../../src/screens/tabs/Profile';

const BottomTabs = ({ navigation }: { navigation: any }) => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'home', title: 'Inicio', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
    { key: 'busqueda', title: 'Buscar', focusedIcon: 'magnify', unfocusedIcon: 'magnify' }, // Ícono actualizado
    { key: 'cart', title: 'Carrito', focusedIcon: 'cart', unfocusedIcon: 'cart-outline' },
    { key: 'profile', title: 'Perfil', focusedIcon: 'account', unfocusedIcon: 'account-outline' },
  ]);

  // Referencias para los componentes
  const cartRef = useRef<any>(null);
  const homeRef = useRef<any>(null);
  const busquedaRef = useRef<any>(null);

  const renderScene = ({ route }: { route: any }) => {
    switch (route.key) {
      case 'home':
        return <Home ref={homeRef} navigation={navigation} />;
      case 'busqueda':
        return <Busqueda ref={busquedaRef} navigation={navigation} />;
      case 'cart':
        return <Cart ref={cartRef} navigation={navigation} />;
      case 'profile':
        return <Profile navigation={navigation} />;
      default:
        return null;
    }
  };

  const handleIndexChange = (newIndex: number) => {
    setIndex(newIndex);
    if (routes[newIndex].key === 'cart' && cartRef.current) {
      cartRef.current.reloadCart();
    }
  };

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={handleIndexChange}
      renderScene={renderScene}
      barStyle={{
        backgroundColor: '#ffffff',
        borderTopWidth: 4,
        borderTopColor: '#e0e0e0',
      }}
      activeColor="#272C73"
      inactiveColor="#6e6e6e"
      shifting={false}
    />
  );
};

export default BottomTabs;
