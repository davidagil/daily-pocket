import React from 'react';
import { ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const LoadingScreen = () => {
  return (
    <SafeAreaView>
        <ActivityIndicator size={24} color='#fff'/>
    </SafeAreaView>
  )
}

export default LoadingScreen;