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
  Modal,
  TouchableOpacity,
} from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import LoginViewModel from '../../viewmodels/LoginViewModel';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

type RootStackParamList = {
  Welcome: undefined;
  Home: undefined;
  Login: undefined;
  Register: undefined;
  Almacen: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [shouldNavigate, setShouldNavigate] = useState(false); // Nuevo estado para navegación pendiente

  const navigation = useNavigation<LoginScreenNavigationProp>();

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        const storedUserRole = await AsyncStorage.getItem('userRole');

        if (storedUserId && storedUserRole) {
          if (storedUserRole === 'Administrador') {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Almacen' }],
            });
          } else {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            });
          }
        }
      } catch (error) {
        console.error('Error al verificar los datos almacenados:', error);
      }
    };

    checkUserLoggedIn();
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

  const handleLogin = async () => {
    try {
      const { id, name, role } = await LoginViewModel.login(email, password);

      await AsyncStorage.setItem('userId', id);
      await AsyncStorage.setItem('userRole', role);

      setMessage({ text: `Bienvenido, ${name}`, type: 'success' });
      setModalVisible(true);

      // Guarda la intención de navegación sin ejecutarla aún
      setShouldNavigate(true);
    } catch (error) {
      if (error instanceof Error) {
        setMessage({ text: error.message, type: 'error' });
      } else {
        setMessage({ text: 'Ocurrió un error desconocido.', type: 'error' });
      }
    }
  };

  const closeModal = () => {
    setModalVisible(false);

    // Ejecuta la navegación pendiente después de cerrar el modal
    if (shouldNavigate) {
      const storedUserRole = AsyncStorage.getItem('userRole').then((role) => {
        if (role === 'Administrador') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Almacen' }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        }
      });
    }
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

        {message && message.type === 'error' && (
          <Text style={styles.errorMessage}>{message.text}</Text>
        )}

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

      {/* Modal para mensajes */}
      <Modal
        transparent
        visible={isModalVisible}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{message?.text}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
              <Text style={styles.modalButtonText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    borderRadius: 4,
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
  errorMessage: {
    color: '#FF0000',
    marginTop:10,
    fontSize: 14,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    fontSize: 16,
    color: '#272C73',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#272C73',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Login;
 
