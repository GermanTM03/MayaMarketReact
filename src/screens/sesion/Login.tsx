import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Keyboard,
} from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

const { width } = Dimensions.get('window');

// Define las rutas
type RootStackParamList = {
  Welcome: undefined;
  Home: undefined;
  Login: undefined;
  Register: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const navigation = useNavigation<LoginScreenNavigationProp>();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleLogin = () => {
    console.log('Login:', { email, password });
    navigation.navigate('Home'); // Navega a 'Home'
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Svg height="150" width={width + 1} style={styles.waveTop}>
          <Path
            d={`M0,50 C150,-30 350,150 600,50 C850,-50 1000,120 ${width + 1},50 L${width + 1},0 L0,0 Z`}
            fill="#272C73"
          />
        </Svg>

        <Image source={require('../../../assets/logos/mayamarketlogo.png')} style={styles.image} />

        <Text style={styles.title}>Iniciar Sesión</Text>

        <TextInput
          label="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <TextInput
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry={!showPassword}
          right={
            <TextInput.Icon
              icon={showPassword ? 'eye-off' : 'eye'}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
          style={styles.input}
        />

        <Button mode="contained" onPress={handleLogin} style={styles.button}>
          Iniciar Sesión
        </Button>

        <Text style={styles.registerText}>
          ¿No tienes cuenta?{' '}
          <Text style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
            Regístrate
          </Text>
        </Text>
      </ScrollView>

      {!isKeyboardVisible && (
        <View style={styles.fixedWaveBottom}>
          <Svg height="150" width={width + 1}>
            <Path
              d={`M0,50 C150,180 350,-40 600,80 C850,180 1000,-50 ${width + 1},80 L${width + 1},150 L0,150 Z`}
              fill="#272C73"
            />
          </Svg>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    justifyContent: 'flex-start',
    paddingTop: 50,
  },
  waveTop: {
    position: 'absolute',
    top: 0,
    width: '100%',
    left: 0,
    right: 0,
  },
  fixedWaveBottom: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    left: 0,
    right: 0,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#272C73',
  },
  input: {
    width: '100%',
    marginBottom: 12,
  },
  button: {
    marginTop: 10,
    width: '100%',
    backgroundColor: '#272C73',
  },
  registerText: {
    marginTop: 15,
    textAlign: 'center',
    color: '#6e6e6e',
  },
  registerLink: {
    color: '#272C73',
    fontWeight: 'bold',
  },
});

export default Login;
