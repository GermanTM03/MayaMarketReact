import React, { useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { TextInput, Button, Text, Avatar } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';  // Para manejar la selección de imagen si sigues usándolo

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (newName: string, newAvatar: string) => void;
  currentName: string;
  currentAvatar: string;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  onClose,
  onSave,
  currentName,
  currentAvatar,
}) => {
  const [newName, setNewName] = useState(currentName);
  const [newAvatar, setNewAvatar] = useState<string | null>(currentAvatar);

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setNewAvatar(result.assets[0].uri); // Actualizar el avatar
    }
  };

  const handleSave = () => {
    onSave(newName, newAvatar || ''); // Pasar el nombre actualizado y el avatar (o cadena vacía si no hay avatar)
    onClose();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      {/* Fondo de la modal */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      {/* Contenido de la modal */}
      <View style={styles.modalContainer}>
        <Text style={styles.title}>Editar Perfil</Text>

        {/* Avatar */}
        {newAvatar ? (
          <Avatar.Image size={100} source={{ uri: newAvatar }} style={styles.avatar} />
        ) : (
          <Avatar.Icon size={100} icon="account" style={styles.avatar} />
        )}

        {/* Botón para cambiar la imagen */}
        <Button
          mode="outlined"
          onPress={handleImagePick}
          style={styles.button}
          labelStyle={styles.buttonText}
        >
          Cambiar Imagen
        </Button>

        {/* Campo de texto para el nuevo nombre */}
        <TextInput
          label="Nuevo Nombre"
          value={newName}
          onChangeText={setNewName}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Nuevo Apellido"
          value={newName}
          onChangeText={setNewName}
          mode="outlined"
          style={styles.input}
        />

        {/* Botón para guardar los cambios */}
        <Button mode="contained" onPress={handleSave} style={styles.button}>
          Guardar
        </Button>

        {/* Botón para cancelar */}
        <Button
          mode="text"
          onPress={onClose}
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscuro semi-transparente
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
    color: '#282948', // Color del título
  },
  input: {
    width: '100%',
    marginBottom: 12,
  },
  button: {
    width: '100%',
    marginVertical: 8,
    backgroundColor: '#282948', // Color de fondo del botón
    borderRadius: 4,
  },
  buttonText: {
    color: '#FFFFFF', // Asegura que el texto del botón sea blanco
  },
  avatar: {
    alignSelf: 'center',
    marginBottom: 16,
    backgroundColor: '#E0E0E0',
  },
});

export default EditProfileModal;
