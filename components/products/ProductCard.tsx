import React from 'react';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { Product } from '../../models/Product';

const ProductCard = ({
  item,
  onViewDetails,
}: {
  item: Product;
  onViewDetails: (product: Product) => void;
}) => (
  <Card style={styles.card}>
    <Card.Cover source={{ uri: item.image_1 }} />
    <Card.Content>
      <Title>{item.name}</Title>
      <Paragraph>Stock: {item.stock}</Paragraph>
      <Paragraph style={styles.price}>$ {item.price.toFixed(2)}</Paragraph>
    </Card.Content>
    <Card.Actions>
      <Button mode="contained" onPress={() => onViewDetails(item)} style={styles.button}>
        Ver Detalles
      </Button>
    </Card.Actions>
  </Card>
);

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    elevation: 3,
    borderRadius: 8,
  },
  price: {
    marginTop: 8,
    fontWeight: 'bold',
    color: '#272C73',
  },
  button: {
    backgroundColor: '#2F37D0',
    borderRadius: 4,
  },
});

export default ProductCard;
