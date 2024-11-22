import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, StyleSheet, ActivityIndicator, View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProductCard from './ProductCard';
import { Product } from '../../models/Product';

const ProductList = ({ onViewDetails }: { onViewDetails: (product: Product) => void }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0); // Control de páginas

  const itemsPerPage = 3; // Cantidad de productos por lote

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const storedUserId = await AsyncStorage.getItem('userId');
      if (!storedUserId) {
        throw new Error('No se encontró el ID de usuario almacenado.');
      }

      const response = await fetch('https://mayaapi.onrender.com/api/products');
      if (!response.ok) {
        throw new Error(`Error al obtener productos: ${response.statusText}`);
      }

      const data: Product[] = await response.json();
      const filteredProducts = data.filter((product) => product.userId !== storedUserId);

      setProducts(filteredProducts);
      setVisibleProducts(filteredProducts.slice(0, itemsPerPage)); // Cargar el primer lote
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const loadMore = useCallback(() => {
    const nextPage = currentPage + 1;
    const startIndex = nextPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    if (startIndex < products.length) {
      setVisibleProducts((prev) => [...prev, ...products.slice(startIndex, endIndex)]);
      setCurrentPage(nextPage);
    }
  }, [currentPage, products]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#272C73" />
        <Text style={styles.loadingText}>Cargando productos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (products.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay productos disponibles.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={visibleProducts}
      renderItem={({ item }) => <ProductCard item={item} onViewDetails={onViewDetails} />}
      keyExtractor={(item) => item._id.toString()}
      contentContainerStyle={styles.listContainer}
      onEndReached={loadMore} // Carga más productos al llegar al final
      onEndReachedThreshold={0.5} // Umbral para iniciar la carga
      ListFooterComponent={
        visibleProducts.length < products.length ? (
          <ActivityIndicator size="small" color="#272C73" />
        ) : (
          <Text style={styles.noMoreText}>No hay más productos</Text>
        )
      }
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#272C73',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#FF0000',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
  },
  noMoreText: {
    textAlign: 'center',
    color: '#272C73',
    marginVertical: 8,
  },
});

export default ProductList;
