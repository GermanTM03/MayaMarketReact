// App.tsx
import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { Provider as PaperProvider } from 'react-native-paper';
import 'react-native-gesture-handler';
import { CartProvider } from './components/context/CarritoContext'; // Importar el CartProvider

const App = () => (
  <CartProvider> {/* Envolvemos la app en el CartProvider */}
    <PaperProvider>
      <AppNavigator />
    </PaperProvider>
  </CartProvider>
);

export default App;
