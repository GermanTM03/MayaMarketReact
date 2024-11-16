import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';

const Home = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>¡Bienvenido al Home!</Text>
      <Button mode="contained" onPress={() => console.log('Navegar a otra funcionalidad')}>
        Explorar
      </Button>
    </View>
  );
};

export default Home;
