import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, IconButton, Text } from 'react-native-paper';

// Define la interfaz para las propiedades del componente
interface UserProfileProps {
  user: {
    name: string;
    lastname: string;
    email: string;
    avatar?: string;
  };
  onEdit: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onEdit }) => {
  return (
    <View style={styles.profileContainer}>
      <Avatar.Image
        size={80}
        source={{ uri: user.avatar || 'https://via.placeholder.com/150' }}
      />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user.name} {user.lastname}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
      </View>
      <IconButton
        icon="pencil"
        size={24}
        onPress={onEdit}
        style={styles.editButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
    elevation: 3,
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#777',
  },
  editButton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 50,
  },
});

export default UserProfile;
