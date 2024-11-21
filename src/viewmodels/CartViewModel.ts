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
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        throw new Error('No se encontró el ID del usuario.');
      }

      const response = await axios.get<CartResponse>(`https://mayaapi.onrender.com/api/cart/${userId}`);
      setCart(response.data);
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const addItemToCart = async (productId: string, quantity: number) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error('No se encontró el ID del usuario.');

      await axios.post('https://mayaapi.onrender.com/api/cart', {
        userId,
        productId,
        quantity,
      });

      loadCart();
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    }
  };

  const removeItem = (productId: string) => {
    if (!cart) return;
    const updatedItems = cart.items.filter((item) => item.productId._id !== productId);
    setCart({ ...cart, items: updatedItems });
  };

  const removeItemFromCart = async (productId: string) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error('No se encontró el ID del usuario.');

      await axios.delete('https://mayaapi.onrender.com/api/cart/remove', {
        data: {
          userId,
          productId,
        },
      });

      removeItem(productId);
    } catch (err: any) {
      setError(err.message || 'Error al eliminar el producto del carrito');
    }
  };

  const changeItemQuantity = async (productId: string, newQuantity: number) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error('No se encontró el ID del usuario.');
  
      // Enviar la solicitud con método PATCH
      await axios.patch('https://mayaapi.onrender.com/api/cart/update', {
        userId,
        productId,
        quantity: newQuantity, // Cantidad que se va a actualizar
      });
  
      // Actualizar el estado local después de la solicitud
      setCart((prevCart) => {
        if (!prevCart) return prevCart;
        const updatedItems = prevCart.items.map((item) =>
          item.productId._id === productId
            ? { ...item, quantity: newQuantity }
            : item
        );
        return { ...prevCart, items: updatedItems };
      });
    } catch (err: any) {
      setError(err.message || 'Error al cambiar la cantidad');
    }
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
    removeItemFromCart,
    changeItemQuantity,
    addItemToCart,
  };
};
