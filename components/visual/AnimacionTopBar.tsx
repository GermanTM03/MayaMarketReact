import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const AnimacionTopBar = () => {
  const slideAnim = useRef(new Animated.Value(-60)).current; // Valor inicial fuera de la pantalla (hacia arriba)

  useEffect(() => {
    // Animar la barra hacia abajo
    Animated.timing(slideAnim, {
      toValue: 0, // Posición final
      duration: 500, // Duración de la animación en milisegundos
      useNativeDriver: false, // Necesario para modificar el layout
    }).start();
  }, [slideAnim]);

  return (
    <Animated.View style={[styles.container, { marginTop: slideAnim }]}>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: '#272C73',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4, // Añade sombra para un diseño más limpio
    width: '100%',
  },
  title: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AnimacionTopBar;
