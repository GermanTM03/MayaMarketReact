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


  
  const clearCart = async () => {
    try {
      setLoading(true);
      setError(null);
  
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error('No se encontró el ID del usuario.');
  
      // Realizar la solicitud DELETE con el cuerpo JSON
      const response = await axios.delete(
        'https://mayaapi.onrender.com/api/cart/clear',
        {
          data: { userId }, // Este es el cuerpo de la solicitud DELETE
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      console.log('Respuesta del servidor:', response.data);
      setCart(null); // Vaciar el carrito en el estado local
    } catch (err: any) {
      console.error(
        'Error en clearCart:',
        err.response?.data || err.message || err
      );
      setError(err.message || 'Error al vaciar el carrito');
    } finally {
      setLoading(false);
    }
  };
  
  

  const proceedToPayment = () => {
    // Lógica para redirigir al flujo de pago
    console.log("Procediendo al pago...");
    // Aquí puedes implementar la navegación o integración con un servicio de pagos
  };
  return {
    cart,
    loading,
    error,
    loadCart,
    removeItem,
    removeItemFromCart,
    changeItemQuantity,
    addItemToCart,
    clearCart,
    proceedToPayment,
  };
};
