import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';

interface CartItem {
  id: string;
  name: string;
  price: string;
  quantity: string;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Estado de carga

  // Función para cargar el carrito
  const loadCart = async () => {
    setLoading(true); // Empezamos por asegurarnos de que el estado de carga esté activado
    try {
      const storedCart = await AsyncStorage.getItem('cart');
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        setCartItems(parsedCart);
      } else {
        setCartItems([]); // Si no hay productos, asegurarse de que el carrito esté vacío
      }
    } catch (error) {
      console.error('Error al cargar el carrito:', error);
      setCartItems([]); // En caso de error, vaciar el carrito
    } finally {
      setLoading(false); // Cuando se termina de cargar, cambia el estado a no cargando
    }
  };

  // useFocusEffect se ejecuta cada vez que la pantalla recibe el enfoque
  useFocusEffect(
    React.useCallback(() => {
      loadCart(); // Cargar el carrito cada vez que la pantalla se enfoque

      const intervalId = setInterval(() => {
        loadCart(); // Recargar el carrito cada 5 segundos
      }, 5000); // 5000 milisegundos = 5 segundos

      return () => {
        clearInterval(intervalId); // Limpiar el intervalo cuando el componente se desmonte
      };
    }, [])
  );

  const saveCart = async (items: CartItem[]) => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(items));
    } catch (error) {
      console.error('Error al guardar el carrito:', error);
    }
  };

  const handleRemoveItem = (id: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    saveCart(updatedCart);
    Alert.alert('Producto eliminado', 'El producto ha sido eliminado del carrito.');
  };

  const handleClearCart = async () => {
    try {
      await AsyncStorage.removeItem('cart');
      setCartItems([]);
      Alert.alert('Carrito vacío', 'Todos los productos han sido eliminados del carrito.');
    } catch (error) {
      console.error('Error al vaciar el carrito:', error);
    }
  };

  // Si está cargando, mostramos un indicador de carga
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E53935" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {cartItems.length === 0 ? (
        <Text style={styles.emptyText}>El carrito está vacío. Agrega productos para comenzar.</Text>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Content>
                <Title>{item.name}</Title>
                <Paragraph>Cantidad: {item.quantity}</Paragraph>
                <Paragraph>Precio total: ${parseFloat(item.price) * parseInt(item.quantity)}</Paragraph>
              </Card.Content>
              <Card.Actions>
                <Button onPress={() => handleRemoveItem(item.id)}>Eliminar</Button>
              </Card.Actions>
            </Card>
          )}
        />
      )}
      {cartItems.length > 0 && (
        <Button mode="contained" onPress={handleClearCart} style={styles.clearButton}>
          Vaciar Carrito
        </Button>
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
  card: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 3,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 20,
    color: '#999',
  },
  clearButton: {
    backgroundColor: '#E53935',
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#999',
  },
});

export default Cart;
