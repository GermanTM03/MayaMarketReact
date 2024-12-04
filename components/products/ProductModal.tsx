import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { Button, Title, Paragraph } from 'react-native-paper';
import { Product } from '../../models/Product';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useCartViewModel } from '../../src/viewmodels/CartViewModel';

interface ProductModalProps {
  product: Product;
  quantity: number;
  setQuantity: (value: number) => void;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, quantity, setQuantity, onClose }) => {
  const [currentImage, setCurrentImage] = useState(product.image_1);
  const [localQuantity, setLocalQuantity] = useState<number>(1);
  const { addItemToCart } = useCartViewModel();

  useEffect(() => {
    if (quantity >= 1 && quantity <= product.stock) {
      setLocalQuantity(quantity);
    } else {
      setLocalQuantity(1);
    }
  }, [quantity, product.stock]);

  useEffect(() => {
    console.log(`Modal abierto para el producto con ID: ${product._id}`);
  }, [product._id]);

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
      const newValue = Math.min(prev + 1, product.stock);
      setQuantity(newValue);
      return newValue;
    });
  };

  const decrementQuantity = () => {
    setLocalQuantity((prev) => {
      const newValue = Math.max(prev - 1, 1);
      setQuantity(newValue);
      return newValue;
    });
  };

  const handleAddToCart = async () => {
    try {
      await addItemToCart(product._id, localQuantity);
      console.log(`Producto ${product.name} agregado al carrito.`);
      onClose();
    } catch (error) {
      console.error('Error al agregar el producto al carrito:', error);
    }
  };

  return (
    <View style={styles.modalContent}>
      {/* Botón Cerrar */}
      <MaterialIcons name="close" size={24} color="#272C73" style={styles.closeIcon} onPress={onClose} />

      {/* Imagen del producto con navegación */}
      <View style={styles.imageContainer}>
        <MaterialIcons
          name="arrow-back-ios"
          size={24}
          color="#272C73"
          onPress={() => handleImageChange('prev')}
        />
        <Image source={{ uri: currentImage }} style={styles.modalImage} />
        <MaterialIcons
          name="arrow-forward-ios"
          size={24}
          color="#272C73"
          onPress={() => handleImageChange('next')}
        />
      </View>

      {/* Información del producto */}
      <Title style={styles.productName}>{product.name}</Title>
      <Paragraph style={styles.productDetails}>
        {product.quantity} {product.size}
      </Paragraph>
      <Paragraph style={styles.productPrice}>$ {product.price.toFixed(2)}</Paragraph>
      <Paragraph style={styles.productStock}>Disponibles: {product.stock}</Paragraph>

      {/* Contenedor de cantidad */}
      <View style={styles.quantityContainer}>
        <Button mode="outlined" onPress={decrementQuantity} style={styles.quantityButton}>
          -
        </Button>
        <Text style={styles.quantityText}>{localQuantity}</Text>
        <Button mode="outlined" onPress={incrementQuantity} style={styles.quantityButton}>
          +
        </Button>
      </View>

      {/* Botón Agregar al carrito */}
      <Button mode="contained" onPress={handleAddToCart} style={styles.addToCartButton}>
        Agregar al Carrito
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
    position: 'relative',
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalImage: {
    width: 250,
    height: 250,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#272C73',
    textAlign: 'center',
    marginBottom: 8,
  },
  productDetails: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#272C73',
    marginVertical: 8,
  },
  productStock: {
    fontSize: 14,
    color: '#777',
    marginBottom: 20,
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
    borderRadius: 20,
    borderColor: '#272C73',
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 15,
    fontWeight: 'bold',
  },
  addToCartButton: {
    backgroundColor: '#272C73',
    borderRadius: 8,
    width: '100%',
    paddingVertical: 10,
    marginTop: 10,
  },
});

export default ProductModal;
