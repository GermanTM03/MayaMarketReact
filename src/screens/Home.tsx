import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Modal, TouchableWithoutFeedback, Text, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import TopBarUser from '../../components/visual/TopBarUser';
import ProductList from '../../components/products/ProductList';
import ProductModal from '../../components/products/ProductModal';
import { Product } from '../../models/Product';

const Home = forwardRef(({ navigation }: { navigation: any }, ref) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>(''); // Inicializar como string vacío
  const [products, setProducts] = useState<Product[]>([]); // Estado para productos

  const { width } = Dimensions.get('window'); // Obtener ancho de la pantalla

  // Exponer métodos al padre usando ref
  useImperativeHandle(ref, () => ({
    reloadProducts,
  }));

  const reloadProducts = async () => {
    try {
      const response = await fetch('https://mayaapi.onrender.com/api/products');
      const data: Product[] = await response.json();
      // Filtrar productos con stock > 0
      const filteredProducts = data.filter((product) => product.stock > 0);
      setProducts(filteredProducts);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
    }
  };

  useEffect(() => {
    reloadProducts();
  }, []);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setModalVisible(false);
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      console.log(`Producto agregado al carrito: ${selectedProduct.name}, Cantidad: ${quantity}`);
    }
    closeModal();
  };

  return (
    <View style={styles.container}>
      {/* TopBar con búsqueda */}
      <TopBarUser />

      {/* Contenido del Home */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Slider de todas las imágenes de los productos */}
        <View style={styles.sliderSection}>
          <FlatList
            horizontal
            pagingEnabled // Habilita desplazamiento página a página
            data={products} // Mostrar todos los productos con stock > 0
            renderItem={({ item }: { item: Product }) => (
              <TouchableOpacity onPress={() => handleViewDetails(item)}>
                <View style={[styles.sliderCard, { width }]}>
                  <Image source={{ uri: item.image_1 }} style={styles.sliderImage} />
                  <View style={styles.imageOverlay}>
                    <Text style={styles.imageText}>{item.name}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item._id.toString()}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Lista completa de productos */}
        <ProductList
          onViewDetails={handleViewDetails}
          navigation={navigation}
          searchQuery={searchQuery} // Filtrado por búsqueda
        />
      </ScrollView>

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
    backgroundColor: ' #C8AD7F', // Fondo azul oscuro para todo el contenedor
  },
  content: {
    paddingBottom: 16,
  },
  sliderSection: {
    backgroundColor: '#272C73', // Fondo azul oscuro
    paddingTop: 0, // Sin margen superior para tocar el TopBarUser
  },
  sliderCard: {
    height: 300, // Altura de cada imagen
    position: 'relative',
    overflow: 'hidden',
  },
  sliderImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    alignItems: 'center',
  },
  imageText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default Home;
