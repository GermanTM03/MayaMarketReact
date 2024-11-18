import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native-paper';
import TopBar from '../../../components/visual/Topbar';
import CartList from '../../../components/cart/CartList';
import PaymentModal from '../../../components/cart/PaymentModal';

interface CartItem {
  id: string;
  name: string;
  price: string;
  quantity: string;
  image: string; // Asegúrate de incluir la propiedad de imagen
}

const Cart = forwardRef((props, ref) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const loadCart = async () => {
    setLoading(true);
    try {
      const storedCart = await AsyncStorage.getItem('cart');
      const items = storedCart ? JSON.parse(storedCart) : [];
      const updatedItems = items.map((item: CartItem) => ({
        ...item,
        image: item.image || 'https://via.placeholder.com/150', // Imagen predeterminada
      }));
      setCartItems(updatedItems);
      calculateTotal(updatedItems);
    } catch (error) {
      console.error('Error al cargar el carrito:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (items: CartItem[]) => {
    const total = items.reduce(
      (sum, item) => sum + parseFloat(item.price) * parseInt(item.quantity || '1'),
      0
    );
    setTotalAmount(total);
  };

  useImperativeHandle(ref, () => ({
    reloadCart: loadCart,
  }));

  useEffect(() => {
    loadCart();
  }, []);

  const handleQuantityChange = (id: string, change: number) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.max(1, parseInt(item.quantity) + change).toString() }
        : item
    );
    setCartItems(updatedCart);
    calculateTotal(updatedCart);
    AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleRemoveItem = (id: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    calculateTotal(updatedCart);
    AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleClearCart = async () => {
    try {
      await AsyncStorage.removeItem('cart');
      setCartItems([]);
      setTotalAmount(0); // Resetear el total
    } catch (error) {
      console.error('Error al vaciar el carrito:', error);
    }
  };

  const handleProceedToPayment = () => {
    setModalVisible(true);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E53935" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <TopBar />
      <View style={styles.container}>
        <Text style={styles.headerText}>Mi Carrito de Compras</Text>
        {cartItems.length === 0 ? (
          <View style={styles.emptyCartContainer}>
            <Text style={styles.emptyCartText}>¡Oh no! No hay productos aún.</Text>
            <Text style={styles.emptyCartSubText}>Agrega productos para comprar.</Text>
          </View>
        ) : (
          <>
            <CartList
              cartItems={cartItems}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemoveItem}
            />
            <Text style={styles.totalText}>Total General: ${totalAmount.toFixed(2)}</Text>
            <View style={styles.buttonGroup}>
              <Button mode="contained" onPress={handleClearCart} style={styles.actionButton}>
                Vaciar Carrito
              </Button>
              <Button mode="contained" onPress={handleProceedToPayment} style={styles.actionButton}>
                Proceder al Pago
              </Button>
            </View>
            <PaymentModal
              visible={modalVisible}
              totalAmount={totalAmount}
              onClose={() => setModalVisible(false)}
              onPayWithPayPal={() => {
                setModalVisible(false);
                console.log('Pago con PayPal');
              }}
              onPayWithCard={() => {
                setModalVisible(false);
                console.log('Pago con Tarjeta');
              }}
            />
          </>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#272C73',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#272C73',
    marginVertical: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 30,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#999',
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#272C73',
    marginBottom: 10,
  },
  emptyCartSubText: {
    fontSize: 16,
    color: '#6e6e6e',
    textAlign: 'center',
  },
});

export default Cart;
