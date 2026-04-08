import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/client';
import { uploadProfileImage } from '@/lib/storage';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const OnboardingScreen = () => {
  const router = useRouter();

  // State
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Auth
  const {user, updateUser} = useAuth();
 
  const pickImage = async () =>  {
    const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access camera roll.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      // A square because avatar is a circle
      aspect: [1,1],
      quality: 0.8
    });

    // If they picked an image
    if(!result.canceled && result.assets[0]){
      setProfileImage(result.assets[0].uri);
    }
  }

  const takePhoto = async () => {
    const {status} = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access camera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      // A square because avatar is a circle
      aspect: [1,1],
      quality: 0.8
    });

    // If they picked an image
    if(!result.canceled && result.assets[0]){
      setProfileImage(result.assets[0].uri);
    }
  }

  const showImagePicker = () => {
    Alert.alert("Select Profile Image", "Choose an option", [
      {text: 'Camera', onPress: takePhoto},
      {text: 'Photo Library', onPress: pickImage},
      {text: "Cancel", style: 'cancel'}
    ])
  }

  const handleComplete = async () => {
    if(!name || !username) {
      Alert.alert("Please fill out values for Name and Username.")
    }

    if(username.length < 3) {
      Alert.alert("Username must be more then 3 characters long.")
    }

    setIsLoading(true);
    try {
      if(!user) {
        throw new Error("User not authenticated.")
      }

      // When we setup the profile we will be updating an existing one. Profile should already be
      // made with the supabase trigger

      // Check if username exists
      const {data: existingUser} = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .neq('id', user.id)
        .single();

      if(existingUser) {
        Alert.alert(
          "Error",
          "This username is already taken. Please choose another one."
        );
        setIsLoading(false);
        return;
      }

      // upload profile image
      let profileImageUrl: string | undefined;
      try {
        if(profileImage) {
          profileImageUrl = await uploadProfileImage(user.id, profileImage)
        }
      } catch (err) {
        Alert.alert(
          "Warning",
          "Failed to upload image."
        );
      }
    
      // Update Profile
      await updateUser({
        name,
        username,
        profileImage: profileImageUrl,
        onboardingCompleted: true
      });
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert("Error", "Failed to complete. Please try again."); 
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
       <View style={styles.content}>
        <View style={styles.header}>
        <Text style={styles.title}>Setup your account</Text>
        </View>

        <View style={styles.form}>
          <TouchableOpacity style={styles.imageContainer} onPress={showImagePicker}>
            {profileImage ? (<Image source={{uri: profileImage}} style={styles.profileImage}/>) : (
               <View style={styles.placeholderImage}>
               <Text style={styles.placeholderText}>+</Text>
             </View>
            )}
            <View style={styles.editBadge}>
              <Text style={styles.editText}>Edit</Text>
            </View>
          </TouchableOpacity>

          <TextInput 
            style={styles.input}
            placeholder='Full Name'
            placeholderTextColor='#999'
            value={name}
            onChangeText={setName}
            autoCapitalize='words'
          />

          <TextInput 
            style={styles.input}
            placeholder='Username'
            placeholderTextColor='#999'
            value={username}
            onChangeText={setUsername}
            autoCapitalize='none'
            autoComplete='username'
          /> 

          <TouchableOpacity style={styles.button} onPress={handleComplete}>
            {isLoading ? (<ActivityIndicator size={24} color='#fff'/>) : (<Text  style={styles.buttonText}>Complete Setup</Text>)}
          </TouchableOpacity> 

        </View>
      </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 32,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    color: '#666',
  },
  form: {
    width: '100%',
    alignItems: 'center',
  },
  imageContainer: {
    marginBottom: 32,
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderColor: '#e0e0e0',
  },
  placeholderImage: { 
    width: 120,
    height: 120,
    backgroundColor: '#f5f5f5',
    position: 'relative',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 48,
    color: '#999'
  },
  editText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16
  },
  input: {
    backgroundColor: '#f5f5f5',
    width: '100%',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  button: {
    backgroundColor: '#000',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '100%'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  linkButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  linkButtonText: {
    fontSize: 14,
    color: '#666',
  },
  linkButtonTextBold:{
   fontWeight: '600',
   color: '#000',
  }
});

export default OnboardingScreen;