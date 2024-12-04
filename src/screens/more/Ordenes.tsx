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
import { Ionicons } from '@expo/vector-icons';
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
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [showQRModal, setShowQRModal] = useState(false); // Modal para QR grande
  const [currentQRCode, setCurrentQRCode] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
          setLoading(false);
          return;
        }

        const response = await fetch(`https://mayaapi.onrender.com/api/orders/product/${userId}`);
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
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const closeModal = () => {
    setModalVisible(false);
    setCurrentImages([]);
    setCurrentImageIndex(0);
  };

  const openImageModal = (images: string[]) => {
    setCurrentImages(images);
    setCurrentImageIndex(0);
    setModalVisible(true);
  };

  const openQRModal = (qrValue: string) => {
    setCurrentQRCode(qrValue);
    setShowQRModal(true);
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
              <TouchableOpacity onPress={() => openImageModal(item.productId.images || [])}>
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
              </View>
              <TouchableOpacity
                style={styles.qrButton}
                onPress={() => openQRModal(item._id)}
              >
                <Ionicons name="qr-code-outline" size={30} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Empieza a vender productos para administrarte</Text>
        }
      />

      {/* Modal para visualizar imágenes */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <Image
            source={{ uri: currentImages[currentImageIndex] }}
            style={styles.modalImage}
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity onPress={() => setCurrentImageIndex((prev) => Math.max(prev - 1, 0))}>
              <Text style={styles.modalButton}>Anterior</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={closeModal}>
              <Text style={styles.modalButton}>Cerrar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                setCurrentImageIndex((prev) => Math.min(prev + 1, currentImages.length - 1))
              }
            >
              <Text style={styles.modalButton}>Siguiente</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal para QR grande */}
      <Modal visible={showQRModal} transparent={true} animationType="fade">
        <View style={styles.qrModalContainer}>
          <View style={styles.qrModalBox}>
            <QRCode value={currentQRCode || ''} size={200} />
            <TouchableOpacity onPress={() => setShowQRModal(false)}>
              <Text style={styles.modalButton}>Cerrar</Text>
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
    marginRight: 20,
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
  qrButton: {
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  qrModalBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalImage: {
    width: 300,
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  modalButton: {
    fontSize: 16,
    color: '#007BFF',
    fontWeight: 'bold',
  },
  disabledButton: {
    color: '#ccc',
  },
});


export default Ordenes;
