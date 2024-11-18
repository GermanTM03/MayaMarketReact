import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

const LectorScreen = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [productInfo, setProductInfo] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    try {
      const product = JSON.parse(data);
      setProductInfo(`Producto: ${product.name}\nPrecio: $${product.price}\nCantidad: ${product.quantity}`);
    } catch (error) {
      Alert.alert('Error', 'El QR escaneado no es válido.');
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Solicitando permiso para acceder a la cámara...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>No se ha concedido acceso a la cámara.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.scannerContainer}>
        {!scanned ? (
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
        ) : (
          <View style={styles.infoContainer}>
            {productInfo ? (
              <Text style={styles.infoText}>{productInfo}</Text>
            ) : (
              <Text style={styles.infoText}>No se encontró información del producto.</Text>
            )}
            <TouchableOpacity
              style={styles.scanAgainButton}
              onPress={() => setScanned(false)}
            >
              <Text style={styles.scanAgainButtonText}>Escanear otro QR</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  infoText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  scanAgainButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#272C73',
    borderRadius: 5,
  },
  scanAgainButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default LectorScreen;
