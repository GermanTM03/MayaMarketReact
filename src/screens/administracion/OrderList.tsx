import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, ActivityIndicator } from 'react-native';
import OrderCard from './OrderCart';

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

const OrderList = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

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
    const filtered = orders.filter((order) => {
      const lowerQuery = query.toLowerCase();
      return (
        order._id.toLowerCase().includes(lowerQuery) || // Filtrar por ID de la orden
        order.userId.name.toLowerCase().includes(lowerQuery) || // Filtrar por nombre de usuario
        order.productId.name?.toLowerCase().includes(lowerQuery) // Filtrar por nombre del producto
      );
    });
    setFilteredOrders(filtered);
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
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por ID, usuario o producto..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
      {filteredOrders.length === 0 ? (
        <View style={styles.noOrdersContainer}>
          <Text style={styles.noOrdersText}>No se encontraron órdenes.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          renderItem={({ item }) => <OrderCard order={item} />}
          keyExtractor={(item) => item._id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  searchInput: {
    height: 40,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
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
