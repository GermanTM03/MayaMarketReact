import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

class UserProfileViewModel {
  private baseUrl = 'https://mayaapi.onrender.com/api/users';

  async getUser(): Promise<User> {
    try {
      // Recupera el ID del usuario desde AsyncStorage
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        throw new Error('No se encontró el ID del usuario.');
      }

      // Hace la solicitud a la API para obtener los datos del usuario
      const response = await axios.get(`${this.baseUrl}/${userId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.status === 404
            ? 'Usuario no encontrado.'
            : 'Error al obtener el usuario.';
        throw new Error(message);
      }
      throw new Error('Error desconocido.');
    }
  }
}

export default new UserProfileViewModel();
