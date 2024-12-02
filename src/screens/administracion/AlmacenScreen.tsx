import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet,Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OrderList from './OrderList';
const AlmacenScreen = () => {
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);

  const handleScan = (data: string) => {
    setScannedData(data);
    setScanning(false);
  };

  return (
    <View style={styles.container}>
    
          <OrderList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});


export default AlmacenScreen;