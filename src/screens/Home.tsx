import React, { useState } from 'react';
import { View, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';
import TopBar from '../../components/visual/Topbar';
import ProductList from '../../components/products/ProductList';
import ProductModal from '../../components/products/ProductModal';
import { Products } from '../../models/Products'; // Importa tu modelo aquí

const Home = () => {
  const [selectedProduct, setSelectedProduct] = useState<Products | null>(null); // Usa el modelo Products
  const [modalVisible, setModalVisible] = useState(false);
  const [quantity, setQuantity] = useState('1');

  const handleViewDetails = (product: Products) => {
    setSelectedProduct(product);
    setQuantity('1'); // Resetea la cantidad al abrir un nuevo producto
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
      <ProductList onViewDetails={handleViewDetails} /> {/* Asegúrate de que ProductList pase un producto de tipo Products */}
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
                    product={selectedProduct} // Aquí se pasa el producto seleccionado
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
};

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
