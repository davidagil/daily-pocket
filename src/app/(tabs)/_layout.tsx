import { useAuth } from "@/context/AuthContext";
import { NativeTabs } from "expo-router/build/native-tabs";
import React from 'react';
import { ActivityIndicator, View } from "react-native";

export default function TabsLayout() {

  const {isLoading} = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
  // <Tabs screenOptions={{tabBarActiveTintColor: "Grey"}}> 
  //   <Tabs.Screen 
  //     name="index" 
  //     options={{ title: "Home", tabBarIcon: ({color, size, focused}) => <Ionicons name={focused ? "home" : "home-outline"} 
  //     color={color} 
  //     size={size}/> 
  //     }} 
  //   />
  //   <Tabs.Screen 
  //     name="profile" 
  //     options={{ title: "Profile", tabBarIcon: ({color, size, focused}) => <Ionicons name={focused ? "person" : "person-outline"} 
  //     color={color} 
  //     size={size}/>
  //     }}
  //   />
  // </Tabs>
  <NativeTabs>
    <NativeTabs.Trigger 
        name="index"
    >
      <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      <NativeTabs.Trigger.Icon sf={'house'}/>

    </NativeTabs.Trigger>
    <NativeTabs.Trigger 
        name="profile"
    >
      <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
      <NativeTabs.Trigger.Icon sf={'person'}/>

    </NativeTabs.Trigger>
  </NativeTabs>
  );
}
