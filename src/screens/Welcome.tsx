import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, PanResponder, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, interpolate } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { StackNavigationProp } from '@react-navigation/stack';

const { width, height } = Dimensions.get('window');

// Define las rutas
type RootStackParamList = {
  Welcome: undefined;
  Home: undefined;
  Login: undefined;
  Register: undefined;
};

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

const pages = [
  {
    id: 4,
    text: 'Tu mejor opción para comprar y vender productos de manera segura',
    image: require('../../assets/imgs/Inicio.png'), // Cambiado a ruta local
  },
];

const AnimatedBubble = ({ delay, size, color, initialX }: { delay: number; size: number; color: string; initialX: number }) => {
  const animation = useSharedValue(0);

  useEffect(() => {
    animation.value = withRepeat(
      withTiming(1, { duration: delay * 1000 }),
      -1, // Infinite loop
      true // Reverse direction
    );
  }, [animation]);

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(animation.value, [0, 1], [height + size, -size]);
    return {
      transform: [{ translateY }],
    };
  });

  return (
    <Animated.View style={[animatedStyle, { position: 'absolute', left: initialX }]}>
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={color} />
      </Svg>
    </Animated.View>
  );
};

const Welcome = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx < -50) {
        nextPage();
      } else if (gestureState.dx > 50) {
        previousPage();
      }
    },
  });

  const backgroundColor = '#FFFFFF'; // Fixed white background
  const textColor = '#000000';
  const bubbleColors = ['rgba(0, 0, 255, 0.4)', 'rgba(255, 0, 0, 0.4)', 'rgba(255, 223, 0, 0.4)', 'rgba(186, 85, 211, 0.4)'];

  return (
    <Animated.View {...panResponder.panHandlers} style={[styles.container, { backgroundColor }]}>
      {/* Burbujas animadas */}
      <View style={styles.bubbles}>
        {[...Array(30)].map((_, i) => (
          <AnimatedBubble
            key={i}
            delay={Math.random() * 4 + 4}
            size={Math.random() * 100 + 60}
            color={bubbleColors[i % bubbleColors.length]}
            initialX={Math.random() * width}
          />
        ))}
      </View>

      {/* Imagen central */}
      <Image source={pages[currentPage].image} style={styles.image} resizeMode="contain" />

      {/* Texto de bienvenida */}
      <Text
  style={[
    styles.text,
    {
      backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fondo blanco semi-transparente
      padding: 10, // Espaciado interno
      borderRadius: 10, // Bordes redondeados
    },
  ]}
>
  {pages[currentPage].text}
</Text>

      {/* Botones dinámicos */}
      {currentPage === pages.length - 1 && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.registerButton, { backgroundColor: '#2F37D0' }]}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.buttonText}>SignUp</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: '#282948' }]}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: '#282948' }]}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.buttonText}>Home</Text>
          </TouchableOpacity>
        </View>
      )}

      {currentPage !== pages.length - 1 && (
        <Text style={[styles.nextArrow]} onPress={nextPage}>
          Next →
        </Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  bubbles: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    zIndex: -1,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '50%',
    marginTop: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30, // Adjusted for spacing
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '80%',
  },
  registerButton: {
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  loginButton: {
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  nextArrow: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#282948',
    position: 'absolute',
    right: 20,
    bottom: 20,
    textDecorationLine: 'underline',
  },
});

export default Welcome;
