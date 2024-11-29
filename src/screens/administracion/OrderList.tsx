import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Asegúrate de tener instalada esta dependencia
import OrderCard from './OrderCart';
import FloatingMenu from './FloatingMenu';

interface Order {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  productId: {
    _id: string;
    name?: string;
    price: number;
  };
  quantity: number;
  status: string;
  createdAt: string;
}

const ITEMS_PER_PAGE = 5;


const OrderList = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [visibleOrders, setVisibleOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);


  const handleMenuSelect = (option: string) => {
    const normalizedOption = option.toLowerCase(); // Normaliza la opción seleccionada
    switch (normalizedOption) {
      case 'pendiente':
        const pendingOrders = orders.filter((order) => order.status.toLowerCase() === 'pendiente');
        setFilteredOrders(pendingOrders);
        setVisibleOrders(pendingOrders.slice(0, ITEMS_PER_PAGE));
        setCurrentPage(1);
        break;
      case 'almacenado':
        const storedOrders = orders.filter((order) => order.status.toLowerCase() === 'almacenado');
        setFilteredOrders(storedOrders);
        setVisibleOrders(storedOrders.slice(0, ITEMS_PER_PAGE));
        setCurrentPage(1);
        break;
      case 'mostrar todos':
        setFilteredOrders(orders); // Restablece todas las órdenes
        setVisibleOrders(orders.slice(0, ITEMS_PER_PAGE)); // Muestra las primeras órdenes
        setCurrentPage(1);
        break;
      case 'cerrar sesión':
        console.log('Cerrar sesión');
        break;
      default:
        console.warn(`Opción desconocida: ${option}`);
        break;
    }
  };
  

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://mayaapi.onrender.com/api/orders');
      if (!response.ok) {
        throw new Error(`Error al obtener órdenes: ${response.status}`);
      }
      const data: Order[] = await response.json();
      setOrders(data);
      setFilteredOrders(data);
      setVisibleOrders(data.slice(0, ITEMS_PER_PAGE));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const lowerQuery = query.toLowerCase();
    const filtered = orders.filter((order) => {
      return (
        order._id.toLowerCase().includes(lowerQuery) || // Filtrar por ID de la orden
        order.userId.name.toLowerCase().includes(lowerQuery) || // Filtrar por nombre de usuario
        order.productId.name?.toLowerCase().includes(lowerQuery) // Filtrar por nombre del producto
      );
    });

    setFilteredOrders(filtered);
    setVisibleOrders(filtered.slice(0, ITEMS_PER_PAGE));
    setCurrentPage(1);
  };

  const loadMoreOrders = () => {
    if (loadingMore) return;

    const nextPage = currentPage + 1;
    const startIndex = currentPage * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    if (startIndex < filteredOrders.length) {
      setLoadingMore(true);
      setVisibleOrders((prevOrders) => [
        ...prevOrders,
        ...filteredOrders.slice(startIndex, endIndex),
      ]);
      setCurrentPage(nextPage);
      setLoadingMore(false);
    }
  };

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
      {/* Topbar */}
      <View style={styles.topbar}>
        <Ionicons name="search" size={20} color="#FFF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por ID, usuario o producto..."
          placeholderTextColor="#D1E7FF"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      {/* List of orders */}
      {filteredOrders.length === 0 ? (
        <View style={styles.noOrdersContainer}>
          <Text style={styles.noOrdersText}>No se encontraron órdenes.</Text>
        </View>
      ) : (
        <FlatList
          data={visibleOrders}
          renderItem={({ item }) => <OrderCard order={item} />}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          onEndReached={loadMoreOrders}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? <ActivityIndicator size="small" color="#007BFF" /> : null
          }
        />
      )}
            <FloatingMenu onSelectOption={handleMenuSelect} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007BFF', // Fondo azul
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 8,
    color: '#FFF', // Icono blanco
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#FFF', // Texto blanco
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noOrdersContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noOrdersText: {
    fontSize: 18,
    color: '#555',
  },
});

export default OrderList;
