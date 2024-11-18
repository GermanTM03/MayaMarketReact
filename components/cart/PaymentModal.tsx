// components/cart/PaymentModal.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Button } from 'react-native-paper';

interface PaymentModalProps {
  visible: boolean;
  totalAmount: number;
  onClose: () => void;
  onPayWithPayPal: () => void;
  onPayWithCard: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  visible,
  totalAmount,
  onClose,
  onPayWithPayPal,
  onPayWithCard,
}) => {
  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Resumen de Pago</Text>
          <Text style={styles.modalText}>Total a pagar: ${totalAmount.toFixed(2)}</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.paymentOption, { backgroundColor: '#3b7bbf' }]}
              onPress={onPayWithPayPal}>
              <Text style={styles.paymentText}>PayPal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.paymentOption, { backgroundColor: '#f5a623' }]}
              onPress={onPayWithCard}>
              <Text style={styles.paymentText}>Tarjeta</Text>
            </TouchableOpacity>
          </View>
          <Button mode="text" onPress={onClose}>
            Cancelar
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  paymentOption: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    width: '45%',
  },
  paymentText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentModal;
