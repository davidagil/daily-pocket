import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const LoginScreen = () => {
  const router = useRouter();

  // state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const {signIn} = useAuth();


  const handleLogin = async () => {
    // Needs better verification for these values in production
    if(!email || !password) {
      Alert.alert("Please fill in all fields");
    }

    setIsLoading(true);
    try {
      await signIn(email, password);
      router.push('/(tabs)');
    } catch (err) {
      Alert.alert(`Error: Invalid Credentials.`);
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
       <View style={styles.content}>
        <Text style={styles.title}>Welcome Back</Text>
        <View style={styles.form}>
          <TextInput 
            placeholder='Email' 
            placeholderTextColor={"#999"} 
            keyboardType='email-address' 
            autoCapitalize='none' 
            autoComplete='email'
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            />
          <TextInput 
            placeholder='Password'
            placeholderTextColor={"#999"} 
            secureTextEntry 
            autoCapitalize='none' 
            autoComplete='password'
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            {isLoading ? (<ActivityIndicator size={24} color='#fff'/>) : (<Text  style={styles.buttonText}>Sign In</Text>)}
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkButton}>
            <Text style={styles.linkButtonText}>Don't have an account? <Text style={styles.linkButtonTextBold} onPress={() => router.push('/(auth)/signup')}>Sign Up</Text></Text>
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
  },
  input: {
    backgroundColor: '#f5f5f5',
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

export default LoginScreen;