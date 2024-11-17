import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, Modal as SplashModal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Title, Paragraph, TextInput } from 'react-native-paper';
import { Products } from '../../models/Products';
import { CartItem } from '../../models/CartItem';

interface ProductModalProps {
  product: Products;
  quantity: string;
  setQuantity: (value: string) => void;
  onClose: () => void;
  onAddToCart: () => void; // Agregado
}

const ProductModal: React.FC<ProductModalProps> = ({ product, quantity, setQuantity, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [splashVisible, setSplashVisible] = useState(false);
  const [reloadMessageVisible, setReloadMessageVisible] = useState(false); // Nuevo estado para el mensaje

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length);
  };

  const handleAddToCart = async () => {
    if (!quantity || parseInt(quantity) <= 0) {
      alert('Por favor, ingresa una cantidad válida.');
      return;
    }

    const newCartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
    };

    try {
      const storedCart = await AsyncStorage.getItem('cart');
      const currentCart: CartItem[] = storedCart ? JSON.parse(storedCart) : [];

      const existingItemIndex = currentCart.findIndex((item) => item.id === product.id);
      if (existingItemIndex !== -1) {
        currentCart[existingItemIndex].quantity = (
          parseInt(currentCart[existingItemIndex].quantity) + parseInt(quantity)
        ).toString();
      } else {
        currentCart.push(newCartItem);
      }

      await AsyncStorage.setItem('cart', JSON.stringify(currentCart));
      setSplashVisible(true);
      setReloadMessageVisible(true);  // Mostrar mensaje de recarga

      setTimeout(() => {
        setSplashVisible(false);
        setReloadMessageVisible(false); // Ocultar mensaje después de un tiempo
        onClose(); // Cerrar modal después de mostrar el mensaje
      }, 1500);
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
    }
  };

  return (
    <View style={styles.modalContent}>
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={handlePrevImage} style={styles.arrowButton}>
          <Text style={styles.arrowText}>{'<'}</Text>
        </TouchableOpacity>
        <Image source={{ uri: product.images[currentImageIndex] }} style={styles.modalImage} />
        <TouchableOpacity onPress={handleNextImage} style={styles.arrowButton}>
          <Text style={styles.arrowText}>{'>'}</Text>
        </TouchableOpacity>
      </View>
      <Title style={styles.modalTitle}>{product.name}</Title>
      <Paragraph style={styles.modalDescription}>{product.description}</Paragraph>
      <Paragraph style={styles.price}>$ {product.price}</Paragraph>

      <TextInput
        label="Cantidad"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
        mode="outlined"
        style={styles.quantityInput}
      />

      <Button mode="contained" onPress={handleAddToCart} style={styles.addToCartButton}>
        Agregar al Carrito
      </Button>
      <Button mode="text" onPress={onClose} style={styles.closeButton}>
        <Text style={styles.closeButtonText}>Cerrar</Text>
      </Button>

      <SplashModal
        visible={splashVisible}
        transparent
        animationType="fade"
      >
        <View style={styles.splashContainer}>
          <Text style={styles.splashText}>Agregado al carrito correctamente</Text>
        </View>
      </SplashModal>

      {/* Mostrar mensaje para recargar el carrito */}
      {reloadMessageVisible && (
        <View style={styles.reloadMessageContainer}>
          <Text style={styles.reloadMessageText}>¡El producto se ha agregado al carrito! Recarga para ver los cambios.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    maxHeight: '100%',
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalImage: {
    width: 300,
    height: 300,
    borderRadius: 8,
  },
  arrowButton: {
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#272C73',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#272C73',
  },
  quantityInput: {
    width: '100%',
    marginBottom: 20,
  },
  addToCartButton: {
    backgroundColor: '#272C73',
    borderRadius: 8,
    width: '100%',
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: 'transparent',
    width: '100%',
  },
  closeButtonText: {
    color: '#E53935',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  splashText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    backgroundColor: '#272C73',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  reloadMessageContainer: {
    marginTop: 20,
    backgroundColor: '#FFF3CD',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#FFEEBA',
    alignItems: 'center',
  },
  reloadMessageText: {
    color: '#856404',
    fontWeight: 'bold',
  },
});

export default ProductModal;
