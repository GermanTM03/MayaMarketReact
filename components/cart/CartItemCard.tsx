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
          {/* Imagen del producto */}
          <Image source={{ uri: item.image }} style={styles.productImage} />
          
          {/* Detalles del producto */}
          <View style={styles.productDetails}>
            <Title>{item.name}</Title>
            <Paragraph>Precio: ${parseFloat(item.price).toFixed(2)}</Paragraph>
          </View>

          {/* Contenedor para la cantidad y el botón eliminar */}
          <View style={styles.quantityContainer}>
            {/* Botones de cantidad */}
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => onQuantityChange(item.id, -1)}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => onQuantityChange(item.id, 1)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Total y botón eliminar */}
        <View style={styles.bottomContainer}>
          <Paragraph>
            Total: ${(parseFloat(item.price) * parseInt(item.quantity || '1')).toFixed(2)}
          </Paragraph>
          <Button mode="text" onPress={() => onRemove(item.id)} style={styles.removeButton}>
            Eliminar
          </Button>
        </View>
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
    justifyContent: 'space-between', // Alinea los elementos a los extremos
  },
  productImage: {
    width: 100, // Aumenta el tamaño de la imagen
    height: 100,
    borderRadius: 8,
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Distribuye el total y el botón de eliminar
    alignItems: 'center',
    marginTop: 10,
  },
  removeButton: {
    marginLeft: 10,
  },
});

export default CartItemCard;
