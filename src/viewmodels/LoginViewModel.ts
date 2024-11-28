import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

class LoginViewModel {
  private baseUrl: string = 'https://mayaapi.onrender.com/api/auth/login';

  async login(email: string, password: string): Promise<{ id: string; name: string; role: string  }> {
    if (!email || !password) {
      throw new Error('Por favor, completa todos los campos.');
    }
  
    try {
      const response = await axios.post(this.baseUrl, { email, password });
      const { id, name,role} = response.data;
      await AsyncStorage.setItem('userId', id);
      await AsyncStorage.setItem('userRole', role); // Guarda también el rol

      return { id, name,role };
    } catch (error) {
      // Verificar si el error es una instancia de AxiosError
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.status === 401
            ? 'Credenciales incorrectas.'
            : 'Error en el servidor. Por favor, inténtalo más tarde.';
        throw new Error(message);
      }
  
      // Manejar otros tipos de errores
      if (error instanceof Error) {
        throw error;
      }
  
      throw new Error('Error desconocido.');
    }
  }
  
  
}

export default new LoginViewModel();
