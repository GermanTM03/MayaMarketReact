import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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

  const fetchOrders = async () => {
    try {
      setLoading(true); // Mostrar indicador de carga
      const response = await fetch('https://mayaapi.onrender.com/api/orders');
      if (!response.ok) {
        throw new Error(`Error al obtener órdenes: ${response.status}`);
      }
      const data: Order[] = await response.json();
      
      // Actualiza tanto las órdenes principales como las filtradas
      setOrders(data); // Guarda todas las órdenes
      setFilteredOrders(data); // Restablece filtro
      setVisibleOrders(data.slice(0, ITEMS_PER_PAGE)); // Muestra primeras órdenes
      setCurrentPage(1); // Reinicia la paginación
    } catch (err) {
      console.error('Error al cargar órdenes:', err);
    } finally {
      setLoading(false); // Detiene indicador de carga
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
        order._id.toLowerCase().includes(lowerQuery) ||
        order.userId.name.toLowerCase().includes(lowerQuery) ||
        order.productId.name?.toLowerCase().includes(lowerQuery)
      );
    });

    setFilteredOrders(filtered);
    setVisibleOrders(filtered.slice(0, ITEMS_PER_PAGE));
    setCurrentPage(1);
  };

  const handleMenuSelect = (option: string) => {
    const normalizedOption = option.toLowerCase();
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
        setFilteredOrders(orders);
        setVisibleOrders(orders.slice(0, ITEMS_PER_PAGE));
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

  const onUpdate = () => {
    fetchOrders(); // Refresca la lista cuando hay cambios
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
      {filteredOrders.length === 0 ? (
        <View style={styles.noOrdersContainer}>
          <Text style={styles.noOrdersText}>No se encontraron órdenes.</Text>
        </View>
      ) : (
        <FlatList
          data={visibleOrders}
          renderItem={({ item }) => <OrderCard order={item} onUpdate={onUpdate} />}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          onEndReached={loadMoreOrders}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? <ActivityIndicator size="small" color="#007BFF" /> : null
          }
        />
      )}
<FloatingMenu
  onSelectOption={handleMenuSelect}
  onSearchUpdate={handleSearch} // Pasamos handleSearch al FloatingMenu
/>
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
    backgroundColor: '#272C73',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 8,
    color: '#FFF',
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#FFF',
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
