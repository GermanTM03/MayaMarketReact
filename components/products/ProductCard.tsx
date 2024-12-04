import React from 'react';
import { Card, Title, Paragraph } from 'react-native-paper';
import { StyleSheet, View, Image, TouchableWithoutFeedback } from 'react-native';
import { Product } from '../../models/Product';
import { MaterialIcons } from '@expo/vector-icons'; // Asegúrate de tener esta librería instalada

const ProductCard = ({
  item,
  onViewDetails,
}: {
  item: Product;
  onViewDetails: (product: Product) => void;
}) => (
  <TouchableWithoutFeedback onPress={() => onViewDetails(item)}>
    <Card style={styles.card}>
      <View style={styles.content}>
        {/* Imagen del producto */}
        <Image source={{ uri: item.image_1 }} style={styles.image} />
        {/* Información del producto */}
        <View style={styles.info}>
          <Title style={styles.name}>{item.name}</Title>
          <Paragraph style={styles.stock}>Por Unidad: {item.quantity} {item.size}</Paragraph>
          <Paragraph style={styles.price}>$ {item.price.toFixed(2)}</Paragraph>
          {/* Información de entrega con ícono */}
          <View style={styles.deliveryContainer}>
            <MaterialIcons name="location-on" size={16} color="#555" />
            <Paragraph style={styles.deliveryText}>
              Cancún, QROO, Universidad Tecnológica de Cancún
            </Paragraph>
          </View>
        </View>
      </View>
    </Card>
  </TouchableWithoutFeedback>
);

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    elevation: 3,
    borderRadius: 8,
    overflow: 'hidden',
    padding: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 16,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  stock: {
    fontSize: 14,
    color: '#6e6e6e',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#272C73',
  },
  deliveryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  deliveryText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 4, // Espaciado entre el ícono y el texto
  },
});

export default ProductCard;
