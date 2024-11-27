import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Title, Paragraph, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image_1: string;
  image_2: string;
  image_3: string;
}

const MisProductosScreen: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedProductImages, setSelectedProductImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserIdAndProducts = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (!storedUserId) {
          console.error('No se encontró el userId almacenado.');
          return;
        }
        setUserId(storedUserId);
        fetchProducts(storedUserId);
      } catch (error) {
        console.error('Error al recuperar el userId:', error);
      }
    };

    fetchUserIdAndProducts();
  }, []);

  const fetchProducts = async (userId: string) => {
    const apiUrl = `https://mayaapi.onrender.com/api/products/user/${userId}`;
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    const apiUrl = `https://mayaapi.onrender.com/api/products/${id}`;
    try {
      const response = await fetch(apiUrl, {
        method: 'DELETE',
      });
      if (response.ok) {
        setProducts((prevProducts) => prevProducts.filter((product) => product._id !== id));
        Alert.alert('Éxito', 'Producto eliminado exitosamente.');
      } else {
        Alert.alert('Error', 'No se pudo eliminar el producto.');
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      Alert.alert('Error', 'Ocurrió un problema al eliminar el producto.');
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Confirmación',
      '¿Estás seguro de eliminar este producto?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: () => deleteProduct(id),
        },
      ],
      { cancelable: true }
    );
  };

  const openModal = (images: string[]) => {
    setSelectedProductImages(images);
    setCurrentImageIndex(0); // Comenzar desde la primera imagen
    setModalVisible(true);
  };

  const showNextImage = () => {
    if (currentImageIndex < selectedProductImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const showPreviousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.listItem}>
      <TouchableOpacity onPress={() => openModal([item.image_1, item.image_2, item.image_3])}>
        <Image source={{ uri: item.image_1 }} style={styles.productImage} />
      </TouchableOpacity>
      <View style={styles.productInfo}>
        <Title>{item.name}</Title>
        <Paragraph>Precio: ${item.price}</Paragraph>
        <Paragraph>Cantidad: {item.quantity}</Paragraph>
      </View>
      <IconButton
        icon="delete"
        iconColor="red"
        onPress={() => handleDelete(item._id)}
        style={styles.deleteButton}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator animating={true} size="large" />
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {/* Modal para imágenes */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedProductImages.length > 0 && (
              <Image
                source={{ uri: selectedProductImages[currentImageIndex] }}
                style={styles.modalImage}
              />
            )}
            <View style={styles.navigationButtons}>
              <TouchableOpacity
                onPress={showPreviousImage}
                disabled={currentImageIndex === 0}
              >
                <Text style={[styles.navButton, currentImageIndex === 0 && styles.disabledNav]}>
                  Anterior
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={showNextImage}
                disabled={currentImageIndex === selectedProductImages.length - 1}
              >
                <Text
                  style={[
                    styles.navButton,
                    currentImageIndex === selectedProductImages.length - 1 && styles.disabledNav,
                  ]}
                >
                  Siguiente
                </Text>
              </TouchableOpacity>
            </View>
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
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
  },
  deleteButton: {
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    width: '90%',
  },
  modalImage: {
    width: 250,
    height: 250,
    marginBottom: 16,
    borderRadius: 8,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
  },
  navButton: {
    color: 'blue',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledNav: {
    color: 'gray',
  },
  closeButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 16,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MisProductosScreen;
