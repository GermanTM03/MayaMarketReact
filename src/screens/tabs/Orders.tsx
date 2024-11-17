import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TopBar from '../../../components/visual/Topbar'; // Asegúrate de usar la ruta correcta


const Orders = () => (
    <View style={styles.container}>
    <TopBar />
    <View style={styles.content}>
      <Text style={styles.text}>¡Bienvenido a Ordenes!</Text>
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
export default Orders;
