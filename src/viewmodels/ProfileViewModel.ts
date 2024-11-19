import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserModel {
  id: string;
  name: string;
  lastname: string;
  email: string;
  image?: string;
}

class ProfileViewModel {
  static async getUser(): Promise<UserModel | null> {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        throw new Error('No se encontró el ID del usuario.');
      }

      const response = await fetch(`https://mayaapi.onrender.com/api/users/${userId}`);
      if (!response.ok) {
        throw new Error('Error al obtener la información del usuario.');
      }

      const data = await response.json();
      return {
        id: data._id,
        name: data.name,
        lastname: data.name,
        email: data.email,
        image: data.image,
      };
    } catch (error) {
      throw error;
    }
  }

  static async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem('userId');
    } catch (error) {
      throw new Error('Error al cerrar sesión.');
    }
  }
}

export default ProfileViewModel;
