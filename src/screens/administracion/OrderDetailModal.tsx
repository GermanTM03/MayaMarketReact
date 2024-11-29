import React from 'react';
import { Modal, Portal, Button, Text } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';

interface OrderDetailModalProps {
  visible: boolean;
  onClose: () => void;
  order: {
    _id: string;
    userId: { name: string };
    quantity: number;
    productId: { price: number };
    status: string;
  } | null;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ visible, onClose, order }) => {
  if (!order) {
    return null;
  }

  const totalPrice = order.quantity * order.productId.price;

  const handleAction = () => {
    if (order.status === 'pendiente') {
      console.log('Almacenado');
    } else if (order.status === 'almacenado') {
      console.log('Completado o Entregado');
    }
    onClose();
  };

  const actionText = order.status === 'pendiente' ? 'Almacenar' : 'Completado o Entregado';

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.modalContainer}>
        <Text style={styles.title}>Detalles de la Orden</Text>
        <Text style={styles.info}>Número de Orden: #{order._id}</Text>
        <Text style={styles.info}>Usuario: {order.userId.name}</Text>
        <Text style={styles.info}>Cantidad: {order.quantity}</Text>
        <Text style={styles.info}>Precio Total: ${totalPrice.toFixed(2)}</Text>
        <View style={styles.buttonContainer}>
          <Button mode="contained" onPress={handleAction} style={styles.button}>
            {actionText}
          </Button>
          <Button mode="outlined" onPress={onClose} style={styles.button}>
            Cerrar
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  info: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    marginHorizontal: 8,
    minWidth: 120,
  },
});

export default OrderDetailModal;
