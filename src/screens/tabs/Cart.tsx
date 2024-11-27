import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, FlatList, Image } from 'react-native';
import { Button } from 'react-native-paper';
import { useCartViewModel } from '../../viewmodels/CartViewModel';
import TopBar from '../../../components/visual/Topbar'; // Asegúrate de usar la ruta correcta
import PaymentComponent from '../../../components/PaymentComponent'; // Importa el componente PaymentComponent

const Cart = forwardRef((_, ref) => {
  const { cart, loading, error, loadCart, removeItemFromCart, changeItemQuantity, clearCart } = useCartViewModel();
  const [showPaymentModal, setShowPaymentModal] = useState(false); // Estado para el modal de pago

  useImperativeHandle(ref, () => ({
    reloadCart: () => {
      console.log('Recargando carrito...');
      loadCart();
    },
  }));

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E53935" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button mode="contained" onPress={loadCart}>
          Reintentar
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopBar />
      <View style={styles.content}>
        <Text style={styles.headerText}>Mi Carrito</Text>
        <FlatList
          data={cart?.items}
          keyExtractor={(item) => item.productId._id}
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              <Image source={{ uri: item.productId.image_1 }} style={styles.image} />
              <View style={styles.info}>
                <Text style={styles.name}>{item.productId.name}</Text>
                <Text style={styles.price}>${item.productId.price.toFixed(2)}</Text>
                <View style={styles.quantityControls}>
                  <Button
                    onPress={() => changeItemQuantity(item.productId._id, Math.max(1, item.quantity - 1))}
                  >
                    -
                  </Button>
                  <Text style={styles.quantity}>{item.quantity}</Text>
                  <Button
                    onPress={() => changeItemQuantity(item.productId._id, item.quantity + 1)}
                  >
                    +
                  </Button>
                </View>
              </View>
              <Button mode="text" onPress={() => removeItemFromCart(item.productId._id)}>
                Eliminar
              </Button>
            </View>
          )}
        />
        <Text style={styles.totalText}>
          Total: ${cart?.items.reduce((sum, item) => sum + item.productId.price * item.quantity, 0).toFixed(2)}
        </Text>
        <View style={styles.footerButtons}>
          <Button
            mode="contained"
            style={styles.button}
            onPress={() => clearCart()}
          >
            Vaciar Carrito
          </Button>
          <Button
            mode="contained"
            style={styles.button}
            onPress={() => setShowPaymentModal(true)} // Mostrar el modal
            color="#4CAF50"
          >
            Proceder al Pago
          </Button>
        </View>
      </View>

      {/* Modal de Pago */}
      <PaymentComponent
        visible={showPaymentModal} // Pasar la propiedad visible
        onClose={() => setShowPaymentModal(false)} // Pasar la función para cerrar
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 60, // Deja espacio para el TopBar
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#272C73',
    textAlign: 'center',
  },
  cartItem: {
    flexDirection: 'row',
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 8,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 14,
    color: '#666',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  quantity: {
    marginHorizontal: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#272C73',
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#999',
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#E53935',
    marginBottom: 10,
  },
});

export default Cart;
