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
import { TextInput, Button, Text, RadioButton } from 'react-native-paper';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';

const { width } = Dimensions.get('window');

// Define las rutas
type RootStackParamList = {
  Welcome: undefined;
  Home: undefined;
  Login: undefined;
  Register: undefined;
};

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

const Register = () => {
  const [name, setName] = useState('');
  const [lastname, setLastName] = useState('');
  const [matricula, setMatricula] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [emailError, setEmailError] = useState(''); // Para mostrar errores en el correo

  const navigation = useNavigation<RegisterScreenNavigationProp>();

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

  // Validar dominio del correo
  const validateEmail = (inputEmail: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@utcancun\.edu\.mx$/;
    if (emailRegex.test(inputEmail)) {
      setEmailError('');
      return true;
    } else {
      setEmailError('El correo debe tener el dominio @utcancun.edu.mx');
      return false;
    }
  };

  const handleRegister = async () => {
    if (!validateEmail(email)) {
      console.log('Correo inválido');
      return;
    }

    if (password !== confirmPassword) {
      console.log('Las contraseñas no coinciden');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('lastName', lastname);
    formData.append('matricula', matricula);
    formData.append('phone', phone);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('gender', gender);

    try {
      const response = await axios.post('https://mayaapi.onrender.com/api/users', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Registro exitoso:', response.data);
      navigation.navigate('Home');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Error al registrarse:', error.response?.data || error.message);
      } else if (error instanceof Error) {
        console.error('Error inesperado:', error.message);
      } else {
        console.error('Error desconocido');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.scrollContainer, { paddingBottom: 50 }]}
        keyboardShouldPersistTaps="handled"
      >
        <Svg height="150" width={width + 1} style={styles.waveTop}>
          <Path
            d={`M0,50 C150,-30 350,150 600,50 C850,-50 1000,120 ${width + 1},50 L${width + 1},0 L0,0 Z`}
            fill="#272C73"
          />
        </Svg>

        <Image source={require('../../../assets/logos/mayamarketlogo.png')} style={styles.image} />

        <Text style={styles.title}>Regístrate</Text>

        <TextInput
          label="Nombre/s"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Apellido/s"
          value={lastname}
          onChangeText={setLastName}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Matrícula"
          value={matricula}
          onChangeText={(text) => {
            const numericText = text.replace(/[^0-9]/g, '').slice(0, 8);
            setMatricula(numericText);
          }}
          mode="outlined"
          style={styles.input}
          keyboardType="numeric"
        />

        <TextInput
          label="Teléfono"
          value={phone}
          onChangeText={(text) => {
            const numericText = text.replace(/[^0-9]/g, '').slice(0, 10);
            setPhone(numericText);
          }}
          mode="outlined"
          keyboardType="phone-pad"
          style={styles.input}
        />

        <TextInput
          label="Correo electrónico"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            validateEmail(text); // Valida mientras se escribe
          }}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          error={!!emailError}
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

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

        <TextInput
          label="Confirmar contraseña"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          mode="outlined"
          secureTextEntry={!showConfirmPassword}
          right={
            <TextInput.Icon
              icon={showConfirmPassword ? 'eye-off' : 'eye'}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          }
          style={styles.input}
        />

        <Text style={styles.subtitle}>Género</Text>
        <RadioButton.Group onValueChange={setGender} value={gender}>
          <View style={styles.radioContainerShort}>
            <RadioButton value="Masculino" />
            <Text style={styles.radioLabel}>Masculino</Text>
            <RadioButton value="Femenino" />
            <Text style={styles.radioLabel}>Femenino</Text>
            <RadioButton value="Otro" />
            <Text style={styles.radioLabel}>Otro</Text>
          </View>
        </RadioButton.Group>

        <Button mode="contained" onPress={handleRegister} style={styles.button}>
          Crear Cuenta
        </Button>

        <Text style={styles.loginText}>
          ¿Ya tienes cuenta?{' '}
          <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
            Inicia Sesión
          </Text>
        </Text>
      </ScrollView>
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
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  radioContainerShort: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioLabel: {
    fontSize: 16,
  },
  button: {
    marginTop: 10,
    width: '100%',
    backgroundColor: '#272C73',
  },
  loginText: {
    marginTop: 15,
    textAlign: 'center',
    color: '#6e6e6e',
  },
  loginLink: {
    color: '#272C73',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
});

export default Register;
