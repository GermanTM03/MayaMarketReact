import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Avatar } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

const VenderScreen = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!name || !description || !price) {
      console.log('Por favor, completa todos los campos.');
      return;
    }

    const product = {
      name,
      description,
      price: parseFloat(price),
      image,
    };

    console.log('Producto agregado:', product);
    // Aquí puedes enviar los datos a un backend o manejar la lógica del producto
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar Producto</Text>

      {image ? (
        <Avatar.Image size={120} source={{ uri: image }} style={styles.avatar} />
      ) : (
        <Avatar.Icon size={120} icon="image" style={styles.avatar} />
      )}

      <Button mode="outlined" onPress={handleImagePick} style={styles.button}>
        Seleccionar Imagen
      </Button>

      <TextInput
        label="Nombre del Producto"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Descripción"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        multiline
        numberOfLines={4}
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

      <Button mode="contained" onPress={handleSubmit} style={styles.submitButton}>
        Agregar Producto
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginVertical: 10,
    borderRadius: 4, // Reducción del redondeo
  },
  submitButton: {
    marginVertical: 10,
    backgroundColor: '#282948', // Color del fondo del botón
    borderRadius: 4, // Reducción del redondeo
  },
  avatar: {
    alignSelf: 'center',
    marginBottom: 16,
    backgroundColor: '#E0E0E0',
  },
});

export default VenderScreen;
