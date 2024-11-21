import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const useUserViewModel = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const updateUser = async (name: string, lastName: string, imageUri: string | null) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Obtener el ID del usuario almacenado localmente
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        throw new Error('No se encontró el ID del usuario.');
      }

      // Crear los datos para enviar como multipart/form-data
      const formData = new FormData();
      formData.append('name', name);
      formData.append('lastName', lastName);
      if (imageUri) {
        const fileName = imageUri.split('/').pop(); // Obtener el nombre del archivo
        formData.append('image', {
          uri: imageUri,
          type: 'image/jpeg', // Cambiar según el tipo de archivo
          name: fileName,
        } as any); // `as any` es necesario para que TypeScript no marque error
      }

      // Enviar la solicitud PUT al endpoint
      const response = await axios.put(
        `https://mayaapi.onrender.com/api/users/${userId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Usuario actualizado:', response.data);
      setSuccess(true);
    } catch (err: any) {
      console.error('Error al actualizar el usuario:', err.message);
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    success,
    updateUser,
  };
};
