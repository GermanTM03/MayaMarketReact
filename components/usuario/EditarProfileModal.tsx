import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { TextInput, Button, Text, Avatar } from 'react-native-paper';
import { useEditProfileViewModel } from '../../src/viewmodels/EditProfileViewModel';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void; // Se reemplaza por lógica de confirmación en el ViewModel
  currentName: string;
  currentAvatar: string;
  userId: string; // ID del usuario
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  onClose,
  onSave,
  currentName,
  currentAvatar,
  userId,
}) => {
  const {
    newName,
    newAvatar,
    loading,
    setNewName,
    handleImagePick,
    updateUser,
    resetFields,
  } = useEditProfileViewModel(currentName, currentAvatar, userId);

  const handleSave = async () => {
    const success = await updateUser();
    if (success) {
      onSave(); // Llama a onSave para notificar que la API fue exitosa
      onClose();
    } else {
      console.error('Error al guardar el perfil');
    }
  };

  const handleCancel = () => {
    resetFields();
    onClose();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <View style={styles.modalContainer}>
        <Text style={styles.title}>Editar Perfil</Text>

        {newAvatar ? (
          <Avatar.Image size={100} source={{ uri: newAvatar }} style={styles.avatar} />
        ) : (
          <Avatar.Icon size={100} icon="account" style={styles.avatar} />
        )}

        <Button
          mode="outlined"
          onPress={handleImagePick}
          style={styles.button}
          labelStyle={styles.buttonText}
        >
          Cambiar Imagen
        </Button>

        <TextInput
          label="Nuevo Nombre"
          value={newName}
          onChangeText={setNewName}
          mode="outlined"
          style={styles.input}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#282948" />
        ) : (
          <Button mode="contained" onPress={handleSave} style={styles.button}>
            Guardar
          </Button>
        )}

        <Button
          mode="text"
          onPress={handleCancel}
          style={styles.button}
          labelStyle={styles.buttonText}
        >
          Cancelar
        </Button>
      </View>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 40,
    marginVertical: 200,
    width: '80%',
    borderRadius: 8,
    elevation: 10,
    zIndex: 1,
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
    backgroundColor: '#282948',
    borderRadius: 4,
  },
  buttonText: {
    color: '#FFFFFF',
  },
  avatar: {
    alignSelf: 'center',
    marginBottom: 16,
    backgroundColor: '#E0E0E0',
  },
});

export default EditProfileModal;
