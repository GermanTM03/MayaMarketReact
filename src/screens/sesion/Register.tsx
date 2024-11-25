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
  const [fullName, setFullName] = useState('');
  const [matricula, setMatricula] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

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

  const handleRegister = () => {
    if (password !== confirmPassword) {
      console.log('Las contraseñas no coinciden');
      return;
    }

    console.log('Register:', {
      fullName,
      matricula,
      phone,
      email,
      password,
      gender,
    });

    navigation.navigate('Home');
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
          label="Nombre completo"
          value={fullName}
          onChangeText={setFullName}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Matrícula"
          value={matricula}
          onChangeText={setMatricula}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Teléfono"
          value={phone}
          onChangeText={setPhone}
          mode="outlined"
          keyboardType="phone-pad"
          style={styles.input}
        />

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
            <RadioButton value="male" />
            <Text style={styles.radioLabel}>Masculino</Text>
            <RadioButton value="female" />
            <Text style={styles.radioLabel}>Femenino</Text>
            <RadioButton value="other" />
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
});

export default Register;
