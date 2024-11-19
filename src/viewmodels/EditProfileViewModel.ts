// src/viewmodels/EditProfileViewModel.ts
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

export const useEditProfileViewModel = (initialName: string, initialAvatar: string) => {
  const [newName, setNewName] = useState(initialName);
  const [newAvatar, setNewAvatar] = useState<string | null>(initialAvatar);

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setNewAvatar(result.assets[0].uri); // Actualiza el avatar
      }
    } catch (error) {
      console.error('Error seleccionando imagen:', error);
    }
  };

  const resetFields = () => {
    setNewName(initialName);
    setNewAvatar(initialAvatar);
  };

  return {
    newName,
    newAvatar,
    setNewName,
    handleImagePick,
    resetFields,
  };
};
