import { Camera, useCameraPermissions, CameraView } from 'expo-camera';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';

type Prop = {
  type: string;
  data: string;
};

type QRScannerProps = {
  onScanComplete: (data: string) => void;
  onClose: () => void;
};

const QRScanner: React.FC<QRScannerProps> = ({ onScanComplete, onClose }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();

      if (status !== 'granted') {
        alert('Lo sentimos, necesitamos acceso a la cámara para usar el escáner.');
      }
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }: Prop) => {
    setScanned(true);
    Alert.alert(
      `Código ${type} escaneado`,
      `ID: ${data}`,
      [
        {
          text: 'Confirmar',
          onPress: () => {
            onScanComplete(data); // Envía el dato al buscador
            onClose(); // Cierra el escáner
          },
        },
      ],
      { cancelable: false }
    );
  };

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Permiso de cámara no concedido.</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Solicitar Permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <CameraView
      style={styles.camera}
      onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
    >
      <View style={styles.overlayContainer}>
        <View style={styles.layerTop} />
        <View style={styles.layerCenter}>
          <View style={styles.layerLeft} />
          <View style={styles.focused} />
          <View style={styles.layerRight} />
        </View>
        <View style={styles.layerBottom} />
      </View>
    </CameraView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  permissionText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  permissionButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlayContainer: {
    flex: 1,
  },
  layerTop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  layerCenter: {
    flexDirection: 'row',
  },
  layerLeft: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  focused: {
    width: 200,
    height: 200,
    borderWidth: 3,
    borderColor: '#00FF00',
    borderRadius: 10,
  },
  layerRight: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  layerBottom: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
});

export default QRScanner;
