import React from 'react';
import { Modal, Portal, Button, Text, ActivityIndicator } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { Alert } from 'react-native';

interface OrderDetailModalProps {
  visible: boolean;
  onClose: () => void;
  onUpdate: () => void; // Nueva prop para actualizar órdenes
  order: {
    _id: string;
    userId: { name: string };
    quantity: number;
    productId: { price: number };
    status: string;
  } | null;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ visible, onClose, onUpdate, order }) => {
  const [loading, setLoading] = React.useState(false);

  if (!order) {
    return null;
  }

  const totalPrice = order.quantity * order.productId.price;

  const handleAction = async () => {
    try {
      setLoading(true);

      const route =
        order.status === 'pendiente'
          ? `https://mayaapi.onrender.com/api/orders/${order._id}/almacenado`
          : `https://mayaapi.onrender.com/api/orders/${order._id}/completado`;

      const response = await fetch(route, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado de la orden.');
      }

      const successMessage =
        order.status === 'pendiente'
          ? 'El pedido se marcó como almacenado.'
          : 'El pedido se marcó como completado.';

      Alert.alert('Éxito', successMessage);
      onUpdate(); // Llama a la función para recargar órdenes
      onClose(); // Cierra el modal
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Ocurrió un error desconocido.'
      );
    } finally {
      setLoading(false);
    }
  };

  const actionText = order.status === 'pendiente' ? 'Almacenar' : 'Completar';

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.modalContainer}>
        <Text style={styles.title}>Detalles de la Orden</Text>
        <Text style={styles.info}>Número de Orden: #{order._id}</Text>
        <Text style={styles.info}>Usuario: {order.userId.name}</Text>
        <Text style={styles.info}>Cantidad: {order.quantity}</Text>
        <Text style={styles.info}>Precio Total: ${totalPrice.toFixed(2)}</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#272C73" />
        ) : (
          <View style={styles.buttonContainer}>
            <Button mode="contained" onPress={handleAction} style={styles.button}>
              {actionText}
            </Button>
            <Button mode="outlined" onPress={onClose} style={styles.button}>
              Cerrar
            </Button>
          </View>
        )}
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
