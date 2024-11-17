import React from 'react';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { StyleSheet } from 'react-native';

const ProductCard = ({
  item,
  onViewDetails,
}: {
  item: { id: string; name: string; description: string; price: string; images: string[] };
  onViewDetails: (product: any) => void;
}) => (
  <Card style={styles.card}>
    <Card.Cover source={{ uri: item.images[0] }} />
    <Card.Content>
      <Title>{item.name}</Title>
      <Paragraph>{item.description}</Paragraph>
      <Paragraph style={styles.price}>$ {item.price}</Paragraph>
    </Card.Content>
    <Card.Actions>
      <Button mode="contained" onPress={() => onViewDetails(item)}>
        Ver Detalles
      </Button>
    </Card.Actions>
  </Card>
);

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 3,
  },
  price: {
    marginTop: 8,
    fontWeight: 'bold',
    color: '#272C73',
  },
});

export default ProductCard;
