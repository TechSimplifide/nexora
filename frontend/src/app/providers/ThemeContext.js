import { createContext } from "react";

export const THEME_STORAGE_KEY = "nexora-theme";

export const ThemeContext = createContext({
  theme: "light",
  isDark: false,
  setTheme: () => {},
  toggleTheme: () => {},
});
