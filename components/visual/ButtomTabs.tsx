import React, { useState, useRef } from 'react';
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

  // Usaremos una referencia para llamar a la función de recarga dentro de Cart
  const cartRef = useRef<any>(null);

  const renderScene = BottomNavigation.SceneMap({
    home: Home,
    orders: Orders,
    cart: () => <Cart ref={cartRef} />, // Pasamos la referencia al componente Cart
    profile: Profile,
  });

  // Detectamos cuando el índice cambia y es Cart
  const handleIndexChange = (newIndex: number) => {
    setIndex(newIndex);

    // Si se selecciona el índice del carrito, llama a la función de recarga
    if (routes[newIndex].key === 'cart' && cartRef.current) {
      cartRef.current.reloadCart(); // Llama a la función de recarga
    }
  };

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={handleIndexChange} // Aquí detectamos el cambio de pestaña
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
