import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Text, TextInput, Button, Card, Divider, Chip, IconButton } from 'react-native-paper';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';

const VenderScreen = () => {
  
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [stock, setStock] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [size, setSize] = useState('');
  const [status, setStatus] = useState('available');
  const [images, setImages] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [scale, setScale] = useState(1);

  const sizeOptions = ['ML', 'Tallas', 'Kg', 'Cm'];

  useEffect(() => {
    const loadUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);
        } else {
          Alert.alert('Error', 'No se encontró el ID del usuario.');
        }
      } catch (error) {
        console.error('Error al obtener el ID de usuario:', error);
        Alert.alert('Error', 'Hubo un problema al cargar el ID del usuario.');
      }
    };

    loadUserId();
  }, []);

  const selectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      if (images.length >= 3) {
        Alert.alert('Error', 'Solo puedes seleccionar 3 imágenes.');
        return;
      }
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, idx) => idx !== index);
    setImages(updatedImages);
  };

  const handleZoomEvent = (event: any) => {
    setScale(Math.max(1, event.nativeEvent.scale)); // Establece un mínimo de escala de 1
  };

  const handleZoomStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      setScale(1); // Restablece el zoom al soltar
    }
  };
  const openImageModal = (imageUri: string) => {
    setSelectedImage(imageUri);
    setModalVisible(true);
  };

  const closeImageModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };
  const handleSubmit = async () => {
    if (images.length < 3) {
      Alert.alert('Error', 'Por favor, selecciona exactamente 3 imágenes.');
      return;
    }

    const data = new FormData();
    data.append('userId', userId);
    data.append('name', name);
    data.append('stock', stock);
    data.append('price', price);
    data.append('quantity', quantity);
    data.append('size', size);
    data.append('status', status);

    images.forEach((image, index) => {
      data.append(`image_${index + 1}`, {
        uri: image,
        name: `image_${index + 1}.jpg`,
        type: 'image/jpeg',
      } as any);
    });

    try {
      const response = await fetch('https://mayaapi.onrender.com/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: data,
      });

      if (response.status === 201) {
        const result = await response.json();
        Alert.alert('Éxito', 'Producto creado exitosamente.');
      } else {
        Alert.alert('Error', 'No se pudo crear el producto.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Hubo un problema con el servidor.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Crear Producto" />
        <Card.Content>
          <TextInput
            label="Nombre del producto"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Stock"
            value={stock}
            onChangeText={setStock}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="Precio"
            value={price}
            onChangeText={setPrice}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="Cantidad por paquete"
            value={quantity}
            onChangeText={setQuantity}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
          />

          <Text style={styles.subtitle}>Tamaño:</Text>
          <View style={styles.chipContainer}>
            {sizeOptions.map((option) => (
              <Chip
                key={option}
                selected={size === option}
                onPress={() => setSize(option)}
                style={[styles.chip, size === option && styles.selectedChip]}
              >
                {option}
              </Chip>
            ))}
          </View>

          <Divider style={styles.divider} />

          <Text style={styles.subtitle}>Imágenes seleccionadas:</Text>
          <View style={styles.imageContainer}>
            {images.map((img, idx) => (
              <View key={idx} style={styles.imageWrapper}>
                      <TouchableOpacity onPress={() => openImageModal(img)}>

                <Image source={{ uri: img }} style={styles.imagePreview} />
                </TouchableOpacity>

                <IconButton
                  icon="close"
                  size={20}
                  onPress={() => removeImage(idx)}
                  style={styles.deleteButton}
                />
              </View>
            ))}
          </View>
          <Button mode="contained" onPress={selectImage} style={styles.button}>
            Seleccionar Imagen
          </Button>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={handleSubmit} style={styles.submitButton}>
            Crear Producto
          </Button>
        </Card.Actions>
      </Card>

 {/* Modal de visualización de imágenes */}
 {selectedImage && (
        <Modal visible={modalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <PinchGestureHandler
              onGestureEvent={handleZoomEvent}
              onHandlerStateChange={handleZoomStateChange}
            >
              <Image
                source={{ uri: selectedImage }}
                style={[styles.modalImage, { transform: [{ scale }] }]}
                resizeMode="contain"
              />
            </PinchGestureHandler>
            <Button mode="contained" onPress={closeImageModal} style={styles.closeButton}>
              Cerrar
            </Button>
          </View>
        </Modal>
 )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  modalImage: { width: '90%', height: '70%' },
  closeButton: { marginTop: 20 },

  card: {
    margin: 8,
    borderRadius: 10,
    elevation: 3,
  },
  input: {
    marginBottom: 12,
  },  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    marginVertical: 16,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  chip: {
    margin: 4,
  },
  selectedChip: {
    backgroundColor: '#6200ee',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  imageWrapper: {
    position: 'relative',
    margin: 8,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  deleteButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#ff4d4d',
  },
  button: {
    marginTop: 12,
  },
  submitButton: {
    backgroundColor: '#282948',
    marginHorizontal: 8,
    marginVertical: 12,
  },
});

export default VenderScreen;
