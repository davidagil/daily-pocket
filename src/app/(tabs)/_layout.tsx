import { useAuth } from "@/context/AuthContext";
import { darkColors, lightColors, useThemeMode } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useSegments } from "expo-router";
import { TabList, TabSlot, TabTrigger, Tabs } from "expo-router/ui";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function TabsLayout() {
  const { isLoading } = useAuth();
  const { isDark } = useThemeMode();
  const colors = isDark ? darkColors : lightColors;

  const segments = useSegments();
  const isProfileFocused = segments[segments.length - 1] === "profile";

  if (isLoading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.text} />
      </View>
    );
  }

  return (
    <Tabs>
      <TabSlot />

      <TabList
        style={[
          styles.tabBar,
          {
            backgroundColor: colors.tabBar,
            shadowOpacity: isDark ? 0.18 : 0.08,
          },
        ]}
      >
        <TabTrigger name="home" href="/" style={styles.tabItem}>
          <View style={styles.tabInner}>
            <Ionicons
              name={!isProfileFocused ? "home" : "home-outline"}
              size={24}
              color={!isProfileFocused ? colors.text : colors.mutedText}
            />
          </View>
        </TabTrigger>

        <TabTrigger name="profile" href="/profile" style={styles.tabItem}>
          <View style={styles.tabInner}>
            <Ionicons
              name={isProfileFocused ? "person" : "person-outline"}
              size={24}
              color={isProfileFocused ? colors.text : colors.mutedText}
            />
          </View>
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabBar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 20,
    height: 68,
    borderRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabInner: {
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
});