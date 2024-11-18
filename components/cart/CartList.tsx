import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import CartItemCard from './CartItemCard';

interface CartListProps {
  cartItems: {
    id: string;
    name: string;
    price: string;
    quantity: string;
    image: string; // Nueva propiedad para la imagen
  }[];
  onQuantityChange: (id: string, change: number) => void;
  onRemove: (id: string) => void;
}

const CartList: React.FC<CartListProps> = ({ cartItems, onQuantityChange, onRemove }) => {
  return (
    <FlatList
      data={cartItems}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <CartItemCard item={item} onQuantityChange={onQuantityChange} onRemove={onRemove} />
      )}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 20,
  },
});

export default CartList;
