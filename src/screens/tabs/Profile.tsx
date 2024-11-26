import React, { useEffect, useState,useImperativeHandle, forwardRef  } from 'react';
import { StyleSheet, View, Alert, ActivityIndicator } from 'react-native';
import { Button, List } from 'react-native-paper';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import UserProfile from '../../../components/usuario/UserProfile';
import EditProfileModal from '../../../components/usuario/EditarProfileModal';
import ProfileViewModel, { UserModel } from '../../viewmodels/ProfileViewModel';

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

const Profile = forwardRef((_, ref) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { bottom } = useSafeAreaInsets();

  const [user, setUser] = useState<UserModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const menuItems: MenuItem[] = [
    { label: 'Vender producto', icon: 'cart-plus', route: 'Vender' },
    { label: 'Mis productos', icon: 'clipboard-list', route: 'MisProductos' },
    { label: 'Almacén', icon: 'warehouse', route: 'Almacen' },
    { label: 'Leer QR', icon: 'qrcode-scan', route: 'Lector' },
    { label: 'Mis QR', icon: 'qrcode', route: 'MisQr' },
    { label: 'Ayuda', icon: 'help-circle', route: 'Ayuda' },
  
  ];

  // Función para exponer métodos al padre
  useImperativeHandle(ref, () => ({
    reloadProfile: async () => {
      console.log('Recargando perfil...');
      await fetchUser();
    },
  }));
  

  // Obtener información del usuario
  const fetchUser = async () => {
    try {
      setLoading(true);
      const userData = await ProfileViewModel.getUser();
      setUser(userData);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Ocurrió un error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleNavigation = (route: keyof RootStackParamList) => {
    navigation.navigate(route);
  };

  const handleLogout = async () => {
    try {
      await ProfileViewModel.logout();
      Alert.alert('Sesión cerrada', 'Has cerrado sesión exitosamente.');
      navigation.navigate('Welcome');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Ocurrió un error');
    }
  };

  const handleEdit = () => {
    setModalVisible(true);
  };

  const handleSave = (newName: string, newAvatar: string) => {
    if (user) {
      setUser({
        ...user,
        name: newName,
        lastname: user.lastname,
        image: newAvatar,
      });
    }
    setModalVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#272C73" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingBottom: bottom }]}>
      <View style={styles.topBar}>
        <View style={styles.wave} />
      </View>

      <View style={styles.content}>
        <UserProfile
          user={{
            name: user?.name || 'Usuario desconocido',
            lastname: user?.lastname || 'Usuario desconocido',
            email: user?.email || 'Correo no disponible',
            avatar: user?.image,
          }}
          onEdit={handleEdit}
        />

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

        <Button mode="contained" onPress={handleLogout} style={styles.logoutButton}>
          Cerrar sesión
        </Button>
      </View>

      <EditProfileModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
        currentName={user?.name || ''}
        currentLastName={user?.lastname || ''}
        currentAvatar={user?.image || ''}
      />
    </View>
  );

});

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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Profile;
