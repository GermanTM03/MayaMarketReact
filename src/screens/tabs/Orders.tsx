import React from 'react';
import { View, Text, StyleSheet, Image, FlatList } from 'react-native';
import TopBar from '../../../components/visual/Topbar'; // Asegúrate de usar la ruta correcta

// Imagen genérica de URL
const defaultImage = 'https://via.placeholder.com/150'; // URL de imagen genérica

// Define los estados posibles con un tipo literal
type ProductStatus = 'Pendiente' | 'Recogido' | 'EnAlmacen';

const products = [
  {
    id: '1',
    name: 'Producto 1',
    quantity: 2,
    status: 'Pendiente' as ProductStatus,
    image: defaultImage, // Imagen genérica de URL
  },
  {
    id: '2',
    name: 'Producto 2',
    quantity: 5,
    status: 'Recogido' as ProductStatus,
    image: defaultImage, // Imagen genérica de URL
  },
  {
    id: '3',
    name: 'Producto 3',
    quantity: 10,
    status: 'EnAlmacen' as ProductStatus,
    image: defaultImage, // Imagen genérica de URL
  },
];

// Crear un objeto de estilos dinámicos para los estados
const statusStyles = {
  Pendiente: { color: 'orange' },
  Recogido: { color: 'green' },
  EnAlmacen: { color: 'blue' },
};

const Orders = () => (
  <View style={styles.container}>
    <TopBar />
    <View style={styles.content}>
      <Text style={styles.title}>¡Bienvenido a Ordenes!</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.productInfo}>
              {/* El estado está ahora en la parte superior */}
              <Text style={[styles.productStatus, statusStyles[item.status]]}>{item.status}</Text>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productQuantity}>Cantidad: {item.quantity}</Text>
            </View>
          </View>
        )}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productQuantity: {
    fontSize: 14,
    color: '#555',
  },
  productStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10, // Espacio para que el estado se separe del nombre
  },
});

export default Orders;
