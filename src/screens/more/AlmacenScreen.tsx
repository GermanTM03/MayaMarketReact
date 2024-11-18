import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Button } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

const AlmacenScreen = () => {
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'Producto A', description: 'Descripción del Producto A', price: 100, quantity: 10 },
    { id: '2', name: 'Producto B', description: 'Descripción del Producto B', price: 200, quantity: 5 },
    { id: '3', name: 'Producto C', description: 'Descripción del Producto C', price: 150, quantity: 8 },
    { id: '4', name: 'Producto D', description: 'Descripción del Producto D', price: 250, quantity: 12 },
    { id: '5', name: 'Producto E', description: 'Descripción del Producto E', price: 300, quantity: 7 },
  ]);

  const handleQuantityChange = (id: string, change: number): void => {
    setProducts((prevProducts) =>
      prevProducts.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, item.quantity + change) } : item
      )
    );
  };

  const renderProduct = ({ item }: { item: Product }): JSX.Element => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.name}</Title>
        <Paragraph>{item.description}</Paragraph>
        <Paragraph>Precio: ${item.price}</Paragraph>
        <Paragraph>Cantidad: {item.quantity}</Paragraph>
        <View style={styles.buttonContainer}>
          <Button title="Restar" onPress={() => handleQuantityChange(item.id, -1)} />
          <Button title="Sumar" onPress={() => handleQuantityChange(item.id, 1)} />
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Almacén</Text>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 3,
    backgroundColor: '#FFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default AlmacenScreen;
