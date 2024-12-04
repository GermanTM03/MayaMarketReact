import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, StyleSheet, ActivityIndicator, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProductCard from './ProductCard';
import { Product } from '../../models/Product';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ProductListProps {
  onViewDetails: (product: Product) => void;
  navigation: any;
  searchQuery: string;
}

const ProductList: React.FC<ProductListProps> = ({ onViewDetails, navigation, searchQuery }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const itemsPerPage = 3;

  const categoriesOptions: { name: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }[] = [
    { name: 'Ropa', icon: 'tshirt-crew' },
    { name: 'Electrónica', icon: 'laptop' },
    { name: 'Hogar', icon: 'home' },
    { name: 'Juguetes', icon: 'toy-brick' },
    { name: 'Deportes', icon: 'basketball' },
    { name: 'Perfumes', icon: 'bottle-tonic' },
    { name: 'Otros', icon: 'dots-horizontal' },
  ];
  

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
      const filteredProducts = data.filter(
        (product) => product.userId !== storedUserId && product.stock > 0
      );

      setProducts(filteredProducts);
      setFilteredProducts(filteredProducts);
      setVisibleProducts(filteredProducts.slice(0, itemsPerPage));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const results =
        selectedCategory === 'Otros'
          ? products.filter(
              (product) =>
                !categoriesOptions.some(
                  (category) => category.name !== 'Otros' && product.categories === category.name
                )
            )
          : products.filter((product) => product.categories === selectedCategory);

      setFilteredProducts(results);
      setVisibleProducts(results.slice(0, itemsPerPage));
      setCurrentPage(0);
    }
  }, [selectedCategory, products]);

  useEffect(() => {
    const query = searchQuery ? searchQuery.toLowerCase() : '';
    const results = products.filter((product) =>
      (product.name || '').toLowerCase().includes(query)
    );
    setFilteredProducts(results);
    setVisibleProducts(results.slice(0, itemsPerPage));
    setCurrentPage(0);
  }, [searchQuery]);

  const loadMore = useCallback(() => {
    const nextPage = currentPage + 1;
    const startIndex = nextPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    if (startIndex < filteredProducts.length) {
      setVisibleProducts((prev) => [...prev, ...filteredProducts.slice(startIndex, endIndex)]);
      setCurrentPage(nextPage);
    }
  }, [currentPage, filteredProducts]);

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
    <View style={{ flex: 1 }}>
      {/* Barra de categorías */}
      <ScrollView 
  horizontal 
  contentContainerStyle={styles.categoriesContainer} 
  showsHorizontalScrollIndicator={false} // Oculta el scroll para un diseño más limpio
>
  {categoriesOptions.map((category) => (
    <TouchableOpacity
      key={category.name}
      style={[
        styles.categoryButton,
        selectedCategory === category.name && styles.selectedCategory,
      ]}
      onPress={() => setSelectedCategory(category.name)}
    >
      <MaterialCommunityIcons
        name={category.icon}
        size={32} // Tamaño consistente
        color={selectedCategory === category.name ? '#fff' : '#272C73'}
      />
      <Text
        style={[
          styles.categoryText,
          selectedCategory === category.name && styles.selectedText,
        ]}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  ))}
</ScrollView>
      {/* Lista de productos */}
      <FlatList
  data={visibleProducts}
  renderItem={({ item }) => <ProductCard item={item} onViewDetails={onViewDetails} />}
  keyExtractor={(item) => item._id.toString()}
  contentContainerStyle={[
    styles.listContainer,
    visibleProducts.length === 0 && styles.emptyListContainer, // Asegura que el contenido esté alineado correctamente
  ]}
  onEndReached={loadMore}
  onEndReachedThreshold={0.5}
  ListFooterComponent={
    visibleProducts.length < filteredProducts.length ? (
      <ActivityIndicator size="small" color="#272C73" />
    ) : (
      <Text style={styles.noMoreText}>No hay más productos</Text>
    )
  }
/>

    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
    flexGrow: 1, // Permite que los productos se alineen hacia arriba
    justifyContent: 'flex-start', // Alinea los productos hacia la parte superior
    
  },
  categoriesContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  }, 
   emptyListContainer: {
    flex: 1, // Ocupa todo el espacio disponible cuando hay pocos productos
    justifyContent: 'flex-start', // Alinea el único producto hacia la parte superior
  },
  
  categoryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70, // Tamaño fijo para hacerlo cuadrado
    height: 70, // Igual que el ancho
    marginHorizontal: 8,
    borderRadius: 8, // Botones ligeramente redondeados
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3, // Sombras para Android
  },
  selectedCategory: {
    backgroundColor: '#272C73',
  },
  categoryText: {
    fontSize: 12,
    color: '#272C73',
    textAlign: 'center', // Mantiene el texto centrado
    marginTop: 4,
  },
  selectedText: {
    color: '#fff',
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
