import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define las rutas
type RootStackParamList = {
  Welcome: undefined;
  Home: undefined;
  Login: undefined;
  Register: undefined;
  Almacen: undefined;
};

// Define el tipo de navegación
type NavigationProp = StackNavigationProp<RootStackParamList>;

type IoniconName =
  | 'time-outline'
  | 'archive-outline'
  | 'list-outline'
  | 'log-out-outline';

interface FloatingMenuProps {
  onSelectOption: (option: string) => void;
}

const FloatingMenu: React.FC<FloatingMenuProps> = ({ onSelectOption }) => {
  const [isVisible, setIsVisible] = useState(false); // Controla la visibilidad del menú
  const navigation = useNavigation<NavigationProp>(); // Especifica el tipo de navegación

  const options: { label: string; icon: IoniconName }[] = [
    { label: 'Pendiente', icon: 'time-outline' },
    { label: 'Almacenado', icon: 'archive-outline' },
    { label: 'Mostrar todos', icon: 'list-outline' },
    { label: 'Cerrar sesión', icon: 'log-out-outline' },
  ];

  const handleLogout = async () => {
    try {
      // Elimina las claves específicas de AsyncStorage
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('userRole');

      // Muestra una alerta de confirmación
      Alert.alert('Sesión cerrada', 'Se ha cerrado tu sesión correctamente.', [
        {
          text: 'Aceptar',
          onPress: () => navigation.navigate('Welcome'), // Redirige a Welcome
        },
      ]);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      Alert.alert('Error', 'No se pudo cerrar la sesión.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Botón flotante para mostrar/ocultar el menú */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setIsVisible((prev) => !prev)}
      >
        <Ionicons name="menu" size={24} color="#FFF" />
      </TouchableOpacity>

      {/* Menú desplegable */}
      {isVisible && (
        <View style={styles.menu}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => {
                setIsVisible(false); // Oculta el menú al seleccionar una opción

                if (option.label === 'Cerrar sesión') {
                  handleLogout(); // Llama a la función de cerrar sesión
                } else {
                  onSelectOption(option.label.toLowerCase());
                }
              }}
            >
              <Ionicons name={option.icon} size={24} color="#007BFF" style={styles.icon} />
              <Text style={styles.menuItemText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  floatingButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  menu: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  icon: {
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
});

export default FloatingMenu;
