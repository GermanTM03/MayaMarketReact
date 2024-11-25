import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


const AdministracionScreen = () => (
    <View style={styles.container}>
    <View style={styles.content}>
      <Text style={styles.text}>¡Bienvenido a AdministracionScreen!</Text>
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
export default AdministracionScreen;
