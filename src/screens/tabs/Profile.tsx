import React from 'react';
import { StyleSheet, View } from 'react-native';
import { List, Button } from 'react-native-paper';
import UserProfile from '../../../components/usuario/UserProfile';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

const Profile = () => {
  const user = {
    name: 'Juan Pérez',
    email: 'juan.perez@example.com',
    avatar: '', // Puedes añadir una URL personalizada si está disponible
  };

  const menuItems: MenuItem[] = [
    { label: 'Vender producto', icon: 'cart-plus', route: 'SellProduct' },
    { label: 'Mis productos', icon: 'clipboard-list', route: 'MyProducts' },
    { label: 'Almacén', icon: 'warehouse', route: 'Storage' },
    { label: 'Leer QR', icon: 'qrcode-scan', route: 'ScanQR' },
    { label: 'Mis QR', icon: 'qrcode', route: 'MyQR' },
    { label: 'Ayuda', icon: 'help-circle', route: 'Help' },
    { label: 'Configuración', icon: 'cog', route: 'Settings' },
  ];

  const handleEdit = () => {
    console.log('Editar perfil');
  };

  const handleNavigation = (route: string) => {
    console.log(`Navegar a ${route}`);
  };

  const handleLogout = () => {
    console.log('Cerrar sesión');
  };

  return (
    <View style={styles.container}>
      <View style={styles.spacerExtraLarge} />
      <UserProfile user={user} onEdit={handleEdit} />
      <View style={styles.spacerLarge} />
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
      <View style={styles.spacerLarge} />
      <Button 
        mode="contained" 
        onPress={handleLogout} 
        style={styles.logoutButton}>
        Cerrar sesión
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
  },
  spacerExtraLarge: {
    height: 60, // Mayor espaciado para empujar el contenido hacia abajo
  },
  spacerLarge: {
    height: 40, // Espaciado grande entre secciones
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
