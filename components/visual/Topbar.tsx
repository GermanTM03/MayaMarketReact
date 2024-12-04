import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface TopBarProps {
  onSearch: (query: string) => void;
  navigateToBusqueda: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onSearch, navigateToBusqueda }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    onSearch(text);
  };

  return (
    <View style={styles.topBar}>
   
      <View style={styles.searchInputContainer}>
        <MaterialIcons name="search" size={24} color="#6e6e6e" />
        <TextInput
          style={styles.textInput}
          placeholder="Buscar en MayaMarket"
          placeholderTextColor="#6e6e6e"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#272C73',
    paddingHorizontal: 10,
    paddingVertical: 18,
  },
  homeButton: {
    marginRight: 10,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    marginLeft: 10,
  },
});

export default TopBar;
