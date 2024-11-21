import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { CartResponse } from '../../models/CartModel';

export const useCartViewModel = () => {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadCart = async () => {
    setLoading(true);
    setError(null);

    try {
      // Obtener el userId almacenado localmente
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        throw new Error('No se encontró el ID del usuario.');
      }

      // Consumir la API del carrito
      const response = await axios.get<CartResponse>(`https://mayaapi.onrender.com/api/cart/${userId}`);
      setCart(response.data);
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const removeItem = (productId: string) => {
    if (!cart) return;
    const updatedItems = cart.items.filter((item) => item.productId._id !== productId);
    setCart({ ...cart, items: updatedItems });
  };

  const changeItemQuantity = (productId: string, quantityChange: number) => {
    if (!cart) return;
    const updatedItems = cart.items.map((item) =>
      item.productId._id === productId
        ? { ...item, quantity: Math.max(1, item.quantity + quantityChange) }
        : item
    );
    setCart({ ...cart, items: updatedItems });
  };

  useEffect(() => {
    loadCart();
  }, []);

  return {
    cart,
    loading,
    error,
    loadCart,
    removeItem,
    changeItemQuantity,
  };
};
