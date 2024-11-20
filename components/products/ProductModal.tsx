import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { Button, Title, Paragraph } from 'react-native-paper';
import { Product } from '../../models/Product';

interface ProductModalProps {
  product: Product;
  quantity: number;
  setQuantity: (value: number) => void;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, quantity, setQuantity, onClose }) => {
  const [currentImage, setCurrentImage] = useState(product.image_1);
  const [localQuantity, setLocalQuantity] = useState<number>(1); // Inicia en 1 por defecto

  useEffect(() => {
    // Asegurar que la cantidad local sea válida al iniciar
    if (quantity >= 1 && quantity <= product.stock) {
      setLocalQuantity(quantity);
    } else {
      setLocalQuantity(1);
    }
  }, [quantity, product.stock]);

  const handleImageChange = (direction: 'next' | 'prev') => {
    const images = [product.image_1, product.image_2, product.image_3];
    const currentIndex = images.indexOf(currentImage);
    const newIndex =
      direction === 'next'
        ? (currentIndex + 1) % images.length
        : (currentIndex - 1 + images.length) % images.length;
    setCurrentImage(images[newIndex]);
  };

  const incrementQuantity = () => {
    setLocalQuantity((prev) => {
      const newValue = Math.min(prev + 1, product.stock); // Incrementar hasta el stock máximo
      setQuantity(newValue); // Actualizar el estado global
      return newValue;
    });
  };

  const decrementQuantity = () => {
    setLocalQuantity((prev) => {
      const newValue = Math.max(prev - 1, 1); // Decrementar hasta un mínimo de 1
      setQuantity(newValue); // Actualizar el estado global
      return newValue;
    });
  };

  return (
    <View style={styles.modalContent}>
      <View style={styles.imageContainer}>
        <Button onPress={() => handleImageChange('prev')}>{'<'}</Button>
        <Image source={{ uri: currentImage }} style={styles.modalImage} />
        <Button onPress={() => handleImageChange('next')}>{'>'}</Button>
      </View>
      <Title>{product.name}</Title>
      <Paragraph>{product.size}</Paragraph>
      <Paragraph>$ {product.price.toFixed(2)}</Paragraph>
      <Paragraph>Stock disponible: {product.stock}</Paragraph>

      <View style={styles.quantityContainer}>
        <Button mode="outlined" onPress={decrementQuantity} style={styles.quantityButton}>
          -
        </Button>
        <Text style={styles.quantityText}>{localQuantity}</Text>
        <Button mode="outlined" onPress={incrementQuantity} style={styles.quantityButton}>
          +
        </Button>
      </View>

      <Button mode="contained" onPress={onClose} style={styles.addToCartButton}>
        Agregar al Carrito
      </Button>
      <Button mode="text" onPress={onClose} style={styles.closeButton}>
        Cerrar
      </Button>
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
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  quantityButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 15,
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
});

export default ProductModal;
