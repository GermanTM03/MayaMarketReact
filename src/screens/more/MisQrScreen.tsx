import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Modal, Text, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const products: Product[] = [
  { id: 1, name: 'Producto 1', price: 100, quantity: 10 },
  { id: 2, name: 'Producto 2', price: 200, quantity: 5 },
  { id: 3, name: 'Producto 3', price: 150, quantity: 8 },
  { id: 4, name: 'Producto 4', price: 300, quantity: 2 },
  { id: 5, name: 'Producto 5', price: 50, quantity: 20 },
];

const MisQrsScreen = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleViewQR = (product: Product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.name}</Title>
        <Paragraph>Precio: ${item.price}</Paragraph>
        <Paragraph>Cantidad: {item.quantity}</Paragraph>
        <Button
          mode="contained"
          onPress={() => handleViewQR(item)}
          style={styles.viewQrButton}
        >
          Ver QR
        </Button>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />

      {/* Modal para mostrar el QR */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>QR de {selectedProduct?.name}</Text>
            {selectedProduct && (
              <QRCode
                value={JSON.stringify({
                  id: selectedProduct.id,
                  name: selectedProduct.name,
                  price: selectedProduct.price,
                  quantity: selectedProduct.quantity,
                })}
                size={200}
              />
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  card: {
    marginBottom: 16,
    elevation: 3,
  },
  viewQrButton: {
    marginTop: 10,
    backgroundColor: '#272C73',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#E53935',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MisQrsScreen;