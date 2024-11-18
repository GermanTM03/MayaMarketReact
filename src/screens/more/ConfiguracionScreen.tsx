import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


const ConfiguracionScreen = () => (
    <View style={styles.container}>
    <View style={styles.content}>
      <Text style={styles.text}>¡Bienvenido a Configuracion!</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
export default ConfiguracionScreen;
