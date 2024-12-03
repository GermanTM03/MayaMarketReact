import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import QRScanner from './QRScanner'; // Importa el componente QRScanner

// Define las rutas
type RootStackParamList = {
  Welcome: undefined;
  Home: undefined;
  Login: undefined;
  Register: undefined;
  Almacen: undefined;
};
interface FloatingMenuProps {
  onSelectOption: (option: string) => void;
  onSearchUpdate: (data: string) => void; // Nueva prop para actualizar el buscador
}

// Define el tipo de navegación
type NavigationProp = StackNavigationProp<RootStackParamList>;

type IoniconName =
  | 'time-outline'
  | 'archive-outline'
  | 'list-outline'
  | 'log-out-outline'
  | 'qr-code-outline';

interface FloatingMenuProps {
  onSelectOption: (option: string) => void;
}

const FloatingMenu: React.FC<FloatingMenuProps> = ({ onSelectOption,onSearchUpdate  }) => {
  const [isVisible, setIsVisible] = useState(false); // Controla la visibilidad del menú
  const [isModalVisible, setIsModalVisible] = useState(false); // Controla la visibilidad del modal
  const navigation = useNavigation<NavigationProp>(); // Especifica el tipo de navegación

  const options: { label: string; icon: IoniconName }[] = [
    { label: 'Pendiente', icon: 'time-outline' },
    { label: 'Almacenado', icon: 'archive-outline' },
    { label: 'Mostrar todos', icon: 'list-outline' },
    { label: 'Lector QR', icon: 'qr-code-outline' },
    { label: 'Cerrar sesión', icon: 'log-out-outline' },
  ];

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('userRole');
      navigation.navigate('Welcome');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
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
                setIsVisible(false);
                if (option.label === 'Cerrar sesión') {
                  handleLogout();
                } else if (option.label === 'Lector QR') {
                  setIsModalVisible(true); // Abre el modal
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

      {/* Modal del lector QR */}
      <Modal
  visible={isModalVisible}
  animationType="slide"
  onRequestClose={() => setIsModalVisible(false)} // Cierra el modal al tocar fuera
>
<QRScanner
  onScanComplete={(data) => {
    onSearchUpdate(data); // Actualiza el buscador mediante la prop
    setIsModalVisible(false); // Cierra el lector QR
  }}
  onClose={() => setIsModalVisible(false)} // También cierra si se pulsa cancelar
/>

</Modal>

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
  },
  menu: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 10,
    elevation: 5,
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
