// App.tsx
import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { Provider as PaperProvider } from 'react-native-paper';
import 'react-native-gesture-handler';

const App = () => (
    <PaperProvider>
      <AppNavigator />
    </PaperProvider>
);

export default App;
