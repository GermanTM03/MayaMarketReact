import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  Modal,
  TouchableOpacity,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Product {
  _id: string;
  name?: string;
  images?: string[];
  price: number;
}

interface Order {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  productId: Product;
  quantity: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const Ordenes = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [customAlertVisible, setCustomAlertVisible] = useState(false); // Estado para la alerta personalizada

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
          setCustomAlertVisible(true); // Muestra la alerta personalizada
          setLoading(false);
          return;
        }

        const response = await fetch(`https://mayaapi.onrender.com/api/orders/user/${userId}`);
        const ordersData: Order[] = await response.json();

        const enrichedOrders = await Promise.all(
          ordersData.map(async (order) => {
            try {
              const productResponse = await fetch(
                `https://mayaapi.onrender.com/api/products/${order.productId._id}`
              );
              const productData = await productResponse.json();
              return {
                ...order,
                productId: {
                  ...order.productId,
                  name: productData.name,
                  images: [productData.image_1, productData.image_2, productData.image_3],
                },
              };
            } catch (productError) {
              console.error(`Error al obtener datos del producto ${order.productId._id}:`, productError);
              return order;
            }
          })
        );

        setOrders(enrichedOrders);
      } catch (error) {
        setCustomAlertVisible(true); // Muestra la alerta personalizada
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const closeModal = () => {
    setModalVisible(false);
    setModalContent(null);
    setCurrentImages([]);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (currentImageIndex < currentImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const previousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <TouchableOpacity>
                <View style={styles.imagesContainer}>
                  {item.productId.images?.slice(0, 1).map((image, index) => (
                    <Image key={index} source={{ uri: image }} style={styles.image} />
                  ))}
                  <Text style={styles.textSmall}>Ver todas las imágenes</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.infoContainer}>
                <Text style={styles.text}>Nombre: {item.productId.name || 'Sin nombre'}</Text>
                <Text style={styles.text}>Precio: ${item.productId.price}</Text>
                <Text style={styles.text}>Cantidad: {item.quantity}</Text>
                <TouchableOpacity>
                  <QRCode value={item._id} size={80} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Empieza a vender productos para administrarte</Text>
        }
      />

      {/* Modal para la alerta personalizada */}
      <Modal visible={customAlertVisible} transparent={true} animationType="slide">
        <View style={styles.alertContainer}>
          <View style={styles.alertBox}>
            <Text style={styles.alertTitle}>¡Aviso!</Text>
            <Text style={styles.alertMessage}>
              No se encontraron órdenes disponibles. Empieza a vender productos para administrarte.
            </Text>
            <TouchableOpacity onPress={() => setCustomAlertVisible(false)} style={styles.alertButton}>
              <Text style={styles.alertButtonText}>Aceptar</Text>
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
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imagesContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 5,
    borderRadius: 5,
  },
  textSmall: {
    fontSize: 12,
    color: '#666',
  },
  infoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 20,
  },
  alertContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  alertBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  alertMessage: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  alertButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  alertButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Ordenes;
