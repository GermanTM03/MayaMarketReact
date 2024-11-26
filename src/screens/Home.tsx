import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { View, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';
import TopBar from '../../components/visual/Topbar';
import ProductList from '../../components/products/ProductList';
import ProductModal from '../../components/products/ProductModal';
import { Product } from '../../models/Product';

const Home = forwardRef((_, ref) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);

  // Exponer métodos al padre usando ref
  useImperativeHandle(ref, () => ({
    reloadProducts: () => {
      console.log('Recargando lista de productos...');
      // Aquí puedes agregar la lógica para recargar la lista de productos si es necesario
    },
  }));

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1); // Resetea la cantidad
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setModalVisible(false);
  };

  const handleAddToCart = () => {
    console.log(`Producto agregado al carrito: ${selectedProduct?.name}, Cantidad: ${quantity}`);
    closeModal();
  };

  return (
    <View style={styles.container}>
      <TopBar />
      {/* Lista de productos */}
      <ProductList onViewDetails={handleViewDetails} />

      {/* Modal para mostrar detalles del producto */}
      {selectedProduct && (
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={closeModal}
        >
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.modalContainer}>
              <TouchableWithoutFeedback>
                <View>
                  <ProductModal
                    product={selectedProduct}
                    quantity={quantity}
                    setQuantity={setQuantity}
                    onAddToCart={handleAddToCart}
                    onClose={closeModal}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default Home;
