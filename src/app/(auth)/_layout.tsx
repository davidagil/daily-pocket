import { Stack } from 'expo-router';
import React from 'react';
const AuthLayout = () => {

  return (
    <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login"/>
        <Stack.Screen name="signup"/>
        <Stack.Screen name="onboarding" />
    </Stack>
  )
}

export default AuthLayout;