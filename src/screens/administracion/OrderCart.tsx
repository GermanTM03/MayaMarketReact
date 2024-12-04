import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Card, Divider } from 'react-native-paper';
import OrderDetailModal from './OrderDetailModal';

interface OrderCardProps {
  order: {
    _id: string;
    userId: { name: string };
    productId: { name?: string; price: number };
    quantity: number;
    status: string;
  };
  onUpdate: () => void; // Nueva prop
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onUpdate }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const statusStyles: Record<string, any> = {
    pendiente: styles.pendiente,
    almacenado: styles.almacenado,
    completado: styles.completado,
  };

  return (
    <>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.header}>
              <Text style={styles.orderId}>#{order._id}</Text>
              <View
                style={[
                  styles.statusContainer,
                  statusStyles[order.status] || styles.statusDefault,
                ]}
              >
                <Text style={styles.statusText}>{order.status}</Text>
              </View>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.label}>Usuario:</Text>
              <Text style={styles.value}>{order.userId.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Producto:</Text>
              <Text style={styles.value}>{order.productId.name || 'Desconocido'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Cantidad:</Text>
              <Text style={styles.value}>{order.quantity}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Valor:</Text>
              <Text style={styles.value}>${(order.productId.price * order.quantity).toFixed(2)}</Text>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
      <OrderDetailModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onUpdate={onUpdate} // Pasa la función onUpdate
        order={order}
      />
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 3,
    backgroundColor: '#FFFFFF',
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E3A8A', // Azul oscuro
  },
  statusContainer: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
    
  },
  pendiente: {
    backgroundColor: '#FFC107', // Amarillo
  },
  almacenado: {
    backgroundColor: '#2196F3', // Verde
  },
  completado: {
    backgroundColor: '#4CAF50', // Azul
  },
  statusDefault: {
    backgroundColor: '#E0E0E0', // Gris
  },
  divider: {
    marginVertical: 8,
    backgroundColor: '#E0E0E0',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151', // Gris oscuro
  },
  value: {
    fontSize: 14,
    color: '#1F2937', // Negro suave
    
  },
});

export default OrderCard;
