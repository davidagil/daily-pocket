import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

type ThemeContextType = {
  theme: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const lightColors = {
  background: "#ffffff",
  card: "#f5f5f5",
  cardBackground: "#f7f7f7",
  text: "#111111",
  mutedText: "#666666",
  border: "#e5e5e5",
  tabBar: "#f5f5f5",
};

export const darkColors = {
  background: "#0f0f10",
  card: "#18181b",
  cardBackground: "#18181b",
  text: "#ffffff",
  mutedText: "#a1a1aa",
  border: "#2a2a2e",
  tabBar: "#18181b",
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<ThemeMode>("light");

  useEffect(() => {
    const loadTheme = async () => {
      const saved = await AsyncStorage.getItem("theme");
      if (saved === "light" || saved === "dark") {
        setTheme(saved);
      }
    };

    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    await AsyncStorage.setItem("theme", next);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark: theme === "dark",
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeMode must be used inside ThemeProvider");
  }
  return context;
};