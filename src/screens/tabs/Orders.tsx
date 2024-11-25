import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator, Modal, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TopBar from '../../../components/visual/Topbar';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';

type Order = {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  productId: {
    _id: string;
  };
  quantity: number;
  status: 'pendiente' | 'completado' | 'almacenado';
  createdAt: string;
  updatedAt: string;
};

type Product = {
  _id: string;
  name: string;
  image_1: string;
  image_2: string;
  image_3: string;
  price: number;
};

type OrderWithProduct = Order & { product?: Product | null };

const defaultImage = 'https://via.placeholder.com/150';

const statusStyles: Record<Order['status'], { color: string }> = {
  pendiente: { color: 'orange' },
  completado: { color: 'green' },
  almacenado: { color: 'blue' },
};

const Orders = () => {
  const [orders, setOrders] = useState<OrderWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        console.error('ID de usuario no encontrado en AsyncStorage');
        return;
      }

      const response = await fetch(`https://mayaapi.onrender.com/api/orders/user/${userId}`);
      if (!response.ok) {
        throw new Error(`Error al obtener órdenes: ${response.status}`);
      }
      const ordersData: Order[] = await response.json();

      const ordersWithProducts = await Promise.all(
        ordersData.map(async (order) => {
          const productId = order.productId._id;
          try {
            const productResponse = await fetch(`https://mayaapi.onrender.com/api/products/${productId}`);
            if (productResponse.ok) {
              const product: Product = await productResponse.json();
              return { ...order, product };
            } else {
              return { ...order, product: null };
            }
          } catch (error) {
            console.error(`Error al obtener el producto ${productId}:`, error);
            return { ...order, product: null };
          }
        })
      );

      setOrders(ordersWithProducts);
    } catch (error) {
      console.error('Error al obtener las órdenes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando órdenes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopBar />
      <View style={styles.content}>
        <Text style={styles.title}>¡Estas son tus ordenes!</Text>
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              {/* Imagen */}
              <TouchableOpacity onPress={() => setSelectedImage(item.product?.image_1 || defaultImage)}>
                <Image source={{ uri: item.product?.image_1 || defaultImage }} style={styles.productImage} />
              </TouchableOpacity>

              {/* Información */}
              <View style={styles.productInfo}>
                <Text style={[styles.productStatus, statusStyles[item.status]]}>{item.status}</Text>
                <Text style={styles.productName}>{item.product?.name || 'Producto sin nombre'}</Text>
                <Text style={styles.productQuantity}>Cantidad: {item.quantity}</Text>
                <Text style={styles.productPrice}>
                  Precio: ${item.product?.price ? item.product.price.toFixed(2) : 'N/A'}
                </Text>
                <Text style={styles.productUser}>Usuario: {item.userId.name}</Text>
              </View>

              {/* Ícono de QR */}
              <TouchableOpacity onPress={() => setSelectedOrderId(item._id)} style={styles.qrIcon}>
                <Ionicons name="qr-code" size={30} color="#000" />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      {/* Modal para imágenes */}
      {selectedImage && (
        <Modal transparent={true} visible={!!selectedImage} animationType="fade">
          <TouchableOpacity style={styles.modalContainer} onPress={() => setSelectedImage(null)}>
            <View style={styles.modalContent}>
              <Image source={{ uri: selectedImage }} style={styles.fullscreenImage} />
              <TouchableOpacity onPress={() => setSelectedImage(null)} style={styles.modalClose}>
                <Text style={styles.modalCloseText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {/* Modal para QR */}
      {selectedOrderId && (
        <Modal transparent={true} visible={!!selectedOrderId} animationType="fade">
          <TouchableOpacity style={styles.modalContainer} onPress={() => setSelectedOrderId(null)}>
            <View style={styles.modalContent}>
              <QRCode value={selectedOrderId} size={200} />
              <TouchableOpacity onPress={() => setSelectedOrderId(null)} style={styles.modalClose}>
                <Text style={styles.modalCloseText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  productCard: { flexDirection: 'row', marginBottom: 20, borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 10, alignItems: 'center' },
  productImage: { width: 80, height: 80, borderRadius: 8, marginRight: 10 },
  productInfo: { flex: 1 },
  productName: { fontSize: 16, fontWeight: 'bold' },
  productQuantity: { fontSize: 14, color: '#555' },
  productPrice: { fontSize: 14, color: '#000' },
  productUser: { fontSize: 14, color: '#666' },
  productStatus: { fontSize: 14, fontWeight: 'bold', marginBottom: 10 },
  qrIcon: { padding: 10 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { backgroundColor: '#fff', borderRadius: 10, padding: 20, alignItems: 'center' },
  modalClose: { marginTop: 20 },
  modalCloseText: { color: '#000', fontSize: 16 },
  fullscreenImage: { width: 300, height: 300, resizeMode: 'contain' },
});

export default Orders;
