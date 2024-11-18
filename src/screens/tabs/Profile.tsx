import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, List } from 'react-native-paper'; // Make sure you import Button from react-native-paper
import UserProfile from '../../../components/usuario/UserProfile';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import EditProfileModal from '../../../components/usuario/EditarProfileModal'; 

type RootStackParamList = {
  Welcome: undefined;
  Vender: undefined;
  MisProductos: undefined;
  Almacen: undefined;
  Lector: undefined;
  MisQr: undefined;
  Ayuda: undefined;
  Configuracion: undefined;
};

interface MenuItem {
  label: string;
  icon: string;
  route: keyof RootStackParamList;
}

const Profile = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { bottom } = useSafeAreaInsets();

  const user = {
    name: 'Juan Pérez',
    email: 'juan.perez@example.com',
    avatar: '', // Puedes añadir una URL personalizada si está disponible
  };

  const menuItems: MenuItem[] = [
    { label: 'Vender producto', icon: 'cart-plus', route: 'Vender' },
    { label: 'Mis productos', icon: 'clipboard-list', route: 'MisProductos' },
    { label: 'Almacén', icon: 'warehouse', route: 'Almacen' },
    { label: 'Leer QR', icon: 'qrcode-scan', route: 'Lector' },
    { label: 'Mis QR', icon: 'qrcode', route: 'MisQr' },
    { label: 'Ayuda', icon: 'help-circle', route: 'Ayuda' },
    { label: 'Configuración', icon: 'cog', route: 'Configuracion' },
  ];

  const handleNavigation = (route: keyof RootStackParamList) => {
    navigation.navigate(route);
  };

  const handleLogout = () => {
    console.log('Cerrar sesión');
    navigation.navigate('Welcome');
  };

  const [modalVisible, setModalVisible] = useState(false);

  const handleEdit = () => {
    setModalVisible(true); // Mostrar el modal cuando se presione "Editar perfil"
  };

  const handleSave = (newName: string, newAvatar: string) => {
    // Aquí puedes guardar el nombre e imagen editados
    console.log('Nuevo nombre:', newName);
    console.log('Nueva imagen:', newAvatar);
  };

  return (
    <View style={[styles.container, { paddingBottom: bottom }]}>
      <View style={styles.topBar}>
        <View style={styles.wave} />
      </View>

      <View style={styles.content}>
        <UserProfile user={user} onEdit={handleEdit} />
        <View style={styles.menuItemsContainer}>
          <List.Section>
            {menuItems.map((item) => (
              <List.Item
                key={item.label}
                title={item.label}
                left={(props) => <List.Icon {...props} icon={item.icon} />}
                onPress={() => handleNavigation(item.route)}
                style={styles.menuItem}
              />
            ))}
          </List.Section>
        </View>

        {/* Button */}
        <Button mode="contained" onPress={handleLogout} style={styles.logoutButton}>
          Cerrar sesión
        </Button>
      </View>

      {/* Modal para editar nombre e imagen */}
      <EditProfileModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
        currentName={user.name}
        currentAvatar={user.avatar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  topBar: {
    height: '28%',
    backgroundColor: '#272C73',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  wave: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  content: {
    flex: 1,
    marginTop: -190,
    paddingHorizontal: 16,
  },
  menuItemsContainer: {
    marginTop: 20,
    paddingBottom: 60,
  },
  menuItem: {
    backgroundColor: '#FFF',
    marginVertical: 4,
    borderRadius: 8,
    elevation: 1,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#E53935',
    borderRadius: 8,
  },
});

export default Profile;
