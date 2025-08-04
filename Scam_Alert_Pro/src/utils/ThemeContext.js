import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemTheme = useColorScheme();
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem("appTheme");
      setTheme(storedTheme || systemTheme || "light");
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    await AsyncStorage.setItem("appTheme", newTheme);
  };

  const isDark = theme === "dark";

  const themeColors = {
    background: isDark ? "#000000" : "#FFFFFF",
    text: isDark ? "#FFFFFF" : "#000000",
    borderbottom: isDark ? "#FFFFFF" : "#EB9E3C",
    card: isDark ? "#35002C" : "#FFFFFF",
    searchBar: isDark ? "#35002C" : "#FFFFFF",
    followbutton: isDark ? "#FFFFFF" : "#5C1150",
    buttontext: isDark ? "#1A1C1E" : "#FFFFFF",
    line: isDark ? "#FFFFFF" : "#0E3173",
    profileborder: isDark ? "#FFFFFF" : "#8E1A7B",
    editbutton: isDark ? "#FFFFFF" : "#8E1A7B",
    notinames: isDark ? "#FFFFFF" : "#173878",
    searchSection: isDark ? "#35002C" : "#FFFFFF",
    profileupdatecolor: isDark ? "#FFFFFF" : "#0E3173",
    profileupdatecolorinput: isDark ? "#FFFFFF" : "#FFFFFF",
    icon: isDark ? "#FFFFFF" : "#000000",
    startborder: isDark ? "#FFFFFF99" : "#FFFFFF",
    startcontainer: isDark ? "#FFFFFF99" : "#FFFFFF",
    loginborder: isDark ? "#FFFFFFB2" : "#FFFFFF",
    logincontainer: isDark ? "#FFFFFFB2" : "#FFFFFF",
    customsubtitle: isDark ? "#FFFFFF" : "#6C7278",
    playbutton: isDark ? "#8E1A7B" : "#FFFFFF",
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, themeColors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
