import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { TextInput, Button, Text, Avatar } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useUserViewModel } from '../../src/viewmodels/UserViewModel';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  currentName: string;
  currentLastName: string;
  currentAvatar: string;
  onSave: (newName: string, newLastName: string, newAvatar: string) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  onClose,
  currentName,
  currentLastName,
  currentAvatar,
  onSave,
}) => {
  const [newName, setNewName] = useState(currentName);
  const [newLastName, setNewLastName] = useState(currentLastName);
  const [newAvatar, setNewAvatar] = useState<string | null>(currentAvatar);

  const { loading, error, success, updateUser } = useUserViewModel();

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setNewAvatar(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    await updateUser(newName, newLastName, newAvatar);
    if (success) {
      onSave(newName, newLastName, newAvatar || '');
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.title}>Editar Perfil</Text>

            {newAvatar ? (
              <Avatar.Image size={100} source={{ uri: newAvatar }} style={styles.avatar} />
            ) : (
              <Avatar.Icon size={100} icon="account" style={styles.avatar} />
            )}

            <Button mode="outlined" onPress={handleImagePick} style={styles.button}>
              Cambiar Imagen
            </Button>

            <TextInput
              label="Nuevo Nombre"
              value={newName}
              onChangeText={setNewName}
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Nuevo Apellido"
              value={newLastName}
              onChangeText={setNewLastName}
              mode="outlined"
              style={styles.input}
            />

            {error && <Text style={styles.errorText}>{error}</Text>}
            {success && <Text style={styles.successText}>Usuario actualizado exitosamente.</Text>}

            <Button mode="contained" onPress={handleSave} style={styles.button} loading={loading}>
              Guardar
            </Button>
            <Button mode="text" onPress={onClose} style={styles.button}>
              Cancelar
            </Button>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  keyboardAvoidingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  modalContainer: {
    marginHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 5,
    maxHeight: '80%', // Asegura que el modal no ocupe más del 80% de la pantalla
  },
  scrollContainer: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#282948',
  },
  input: {
    width: '100%',
    marginBottom: 12,
  },
  button: {
    width: '100%',
    marginVertical: 8,
    borderRadius: 4,
  },
  avatar: {
    alignSelf: 'center',
    marginBottom: 16,
    backgroundColor: '#E0E0E0',
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
  successText: {
    color: 'green',
    marginBottom: 8,
  },
});

export default EditProfileModal;
