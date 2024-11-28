import React from 'react';
import { StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { Text, View } from 'react-native';

interface OrderCardProps {
  order: {
    _id: string;
    userId: { name: string };
    productId: { name?: string; price: number };
    quantity: number;
    status: string;
  };
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.orderId}>ID de Orden: {order._id}</Text>
        <Text style={styles.userName}>Usuario: {order.userId.name}</Text>
        <Text style={styles.productName}>Producto: {order.productId.name || 'Producto desconocido'}</Text>
        <Text style={styles.quantity}>Cantidad: {order.quantity}</Text>
        <Text style={styles.price}>Precio: ${order.productId.price.toFixed(2)}</Text>
        <Text style={styles.status}>Estado: {order.status}</Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 3,
    backgroundColor: '#FFF',
  },
  orderId: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  userName: {
    fontSize: 16,
    marginBottom: 4,
  },
  productName: {
    fontSize: 16,
    marginBottom: 4,
  },
  quantity: {
    fontSize: 14,
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default OrderCard;
