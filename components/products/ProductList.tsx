import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import ProductCard from './ProductCard';

const products = Array.from({ length: 20 }, (_, i) => ({
  id: i.toString(),
  name: `Producto ${i + 1}`,
  description: `Descripción del producto ${i + 1}`,
  price: (Math.random() * 100).toFixed(2),
  images: [
    'https://via.placeholder.com/300',
    'https://via.placeholder.com/300/0000FF',
    'https://via.placeholder.com/300/FF0000',
  ],
}));

const ProductList = ({ onViewDetails }: { onViewDetails: (product: any) => void }) => {
  return (
    <FlatList
      data={products}
      renderItem={({ item }) => <ProductCard item={item} onViewDetails={onViewDetails} />}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
});

export default ProductList;
