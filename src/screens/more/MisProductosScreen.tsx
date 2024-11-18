import React from 'react';
import { View, StyleSheet, FlatList, Alert, Image } from 'react-native';
import { Card, Title, Paragraph, IconButton } from 'react-native-paper';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string; // URL de la imagen del producto
}

const products: Product[] = [
  {
    id: 1,
    name: 'Producto 1',
    price: 100,
    quantity: 10,
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 2,
    name: 'Producto 2',
    price: 200,
    quantity: 5,
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 3,
    name: 'Producto 3',
    price: 150,
    quantity: 8,
    image: 'https://via.placeholder.com/150',
  },
];

const MisProductosScreen = () => {
  const handleDelete = (id: number) => {
    Alert.alert(
      'Confirmación',
      '¿Estás seguro de eliminar este producto?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: () => {
            // Aquí va la lógica para eliminar el producto
            console.log(`Producto ${id} eliminado`);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.listItem}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Title>{item.name}</Title>
        <Paragraph>Precio: ${item.price}</Paragraph>
        <Paragraph>Cantidad: {item.quantity}</Paragraph>
      </View>
      <IconButton
        icon="delete"
        iconColor="red"
        onPress={() => handleDelete(item.id)}
        style={styles.deleteButton}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listContainer: {
    padding: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
  },
  deleteButton: {
    marginLeft: 8,
  },
});

export default MisProductosScreen;
