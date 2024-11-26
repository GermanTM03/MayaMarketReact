import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, Image, ActivityIndicator, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import { useCartViewModel } from '../../viewmodels/CartViewModel';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';

// Define las rutas
type RootStackParamList = {
  Welcome: undefined;
  Home: undefined;
  Login: undefined;
  MisQr: undefined;
};

type MisQrScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MisQr'>;

const PaymentGateway = () => {
  const { cart } = useCartViewModel();
  const [showWebView, setShowWebView] = useState(false);
  const [webViewUrl, setWebViewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const navigation = useNavigation<MisQrScreenNavigationProp>();

  // Calcular el monto total del carrito
  const totalAmount = cart?.items
    ?.reduce((sum, item) => sum + item.productId.price * item.quantity, 0)
    .toFixed(2) ?? '0.00';

  const handlePayPalPayment = async () => {
    setLoading(true);

    try {
      const response = await fetch('https://mayaapi.onrender.com/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ totalAmount }),
      });

      if (!response.ok) {
        throw new Error('Error al generar la orden de PayPal.');
      }

      const data = await response.json();

      if (data.approvalUrl) {
        setWebViewUrl(data.approvalUrl);
        setShowWebView(true);
      } else {
        throw new Error('No se pudo obtener el enlace de aprobación de PayPal.');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Ocurrió un error al procesar el pago.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigationStateChange = async (navState: any) => {
    const { url } = navState;

    if (url.includes('success')) {
      setShowWebView(false);

      // Mostrar pantalla de procesamiento
      setShowSplash(true);

      try {
        // Recuperar el userId de AsyncStorage
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) throw new Error('No se encontró el ID de usuario.');

        // Enviar solicitud a la API para actualizar el stock
        const response = await fetch('https://mayaapi.onrender.com/api/cart/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
          throw new Error('Error al procesar el pedido.');
        }

        // Simular tiempo de procesamiento para el splash
        await new Promise((resolve) => setTimeout(resolve, 5000));

        // Redirigir a la pantalla "MisQr"
        navigation.navigate('MisQr');
      } catch (error) {
        Alert.alert('Error', error instanceof Error ? error.message : 'Error desconocido.');
        setShowSplash(false); // Ocultar splash si ocurre un error
      }
    } else if (url.includes('cancel')) {
      setShowWebView(false);
      Alert.alert('Pago Cancelado', 'El proceso de pago fue cancelado.');
    }
  };

  if (showSplash) {
    return (
      <View style={styles.splashContainer}>
        <ActivityIndicator size="large" color="#272C73" />
        <Text style={styles.splashText}>Procesando su pedido...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showWebView ? (
        <WebView
          source={{ uri: webViewUrl }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          sharedCookiesEnabled={true}
          thirdPartyCookiesEnabled={true}
          onNavigationStateChange={handleNavigationStateChange}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onError={(error) => {
            Alert.alert('Error', 'No se pudo cargar el pago. Inténtalo nuevamente.');
            setShowWebView(false);
          }}
        />
      ) : (
        <>
          <Text style={styles.headerText}>Resumen de Compra</Text>
          <FlatList
            data={cart?.items}
            keyExtractor={(item) => item.productId._id}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <Image source={{ uri: item.productId.image_1 }} style={styles.image} />
                <View style={styles.info}>
                  <Text style={styles.name}>{item.productId.name}</Text>
                  <Text style={styles.price}>${item.productId.price.toFixed(2)}</Text>
                  <Text style={styles.quantity}>Cantidad: {item.quantity}</Text>
                </View>
              </View>
            )}
          />
          <Text style={styles.totalText}>Total: ${totalAmount}</Text>
          <Button
            mode="contained"
            onPress={handlePayPalPayment}
            style={styles.button}
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Pagar con PayPal'}
          </Button>
        </>
      )}
      {loading && <ActivityIndicator size="large" color="#272C73" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
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
  quantity: {
    marginTop: 5,
    fontSize: 14,
    color: '#666',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
    color: '#272C73',
  },
  webview: {
    flex: 1,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#272C73',
  },
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  splashText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#272C73',
  },
});

export default PaymentGateway;
