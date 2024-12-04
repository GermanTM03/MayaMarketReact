import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  name: string;
  lastName: string;
  image: string;
}

const TopBarUser = () => {
  const [user, setUser] = useState<User | null>(null);

  const fetchUserData = async () => {
    try {
      // Obtener el ID del usuario desde AsyncStorage
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'No se encontró el ID del usuario.');
        return;
      }

      // Hacer la solicitud a la API
      const response = await fetch(`https://mayaapi.onrender.com/api/users/${userId}`);
      if (!response.ok) {
        throw new Error('Error al obtener los datos del usuario.');
      }

      const data = await response.json();
      setUser({
        name: data.name,
        lastName: data.lastName,
        image: data.image,
      });
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Error desconocido.');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (!user) {
    return <View style={styles.loader} />;
  }

  return (
    <View style={styles.topBar}>
      <Image source={{ uri: user.image }} style={styles.avatar} />
      <View style={styles.userInfo}>
        <Text style={styles.name}>{`${user.name} ${user.lastName}`}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#272C73',
    padding: 16,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  loader: {
    height: 60,
    backgroundColor: '#272C73',
  },
});

export default TopBarUser;
