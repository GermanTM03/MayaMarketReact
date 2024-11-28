import React, { useState } from 'react';
import { View, Button, StyleSheet, Text } from 'react-native'; // Asegúrate de importar Text
import OrderList from './OrderList';
import QRScanner from './QRScanner';

const OrdersScreen = () => {
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);

  const handleScan = (data: string) => {
    setScannedData(data);
    setScanning(false);
  };

  return (
    <View style={styles.container}>
      {scanning ? (
        <QRScanner onScan={handleScan} />
      ) : (
        <>
          <Button title="Escanear QR" onPress={() => setScanning(true)} />
          {scannedData && <Text>Dato escaneado: {scannedData}</Text>}
          <OrderList />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default OrdersScreen;
