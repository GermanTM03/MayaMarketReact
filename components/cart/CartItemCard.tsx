import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';

interface CartItemCardProps {
  item: {
    id: string;
    name: string;
    price: string;
    quantity: string;
    image: string; // Nueva propiedad para la imagen
  };
  onQuantityChange: (id: string, change: number) => void;
  onRemove: (id: string) => void;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item, onQuantityChange, onRemove }) => {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.productContainer}>
          <Image source={{ uri: item.image }} style={styles.productImage} />
          <View style={styles.productDetails}>
            <Title>{item.name}</Title>
            <Paragraph>Precio: ${parseFloat(item.price).toFixed(2)}</Paragraph>
          </View>
        </View>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => onQuantityChange(item.id, -1)}>
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => onQuantityChange(item.id, 1)}>
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
          <Button mode="text" onPress={() => onRemove(item.id)} style={styles.removeButton}>
            Eliminar
          </Button>
        </View>
        <Paragraph>
          Total: ${(parseFloat(item.price) * parseInt(item.quantity || '1')).toFixed(2)}
        </Paragraph>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 3,
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  productImage: {
    width: 100, // Aumenta el ancho de la imagen
    height: 100, // Aumenta la altura de la imagen
    borderRadius: 8,
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  quantityButton: {
    backgroundColor: '#E53935',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  quantityButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  removeButton: {
    marginLeft: 10,
  },
});

export default CartItemCard;
