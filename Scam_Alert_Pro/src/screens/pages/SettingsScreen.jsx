import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Navbar from "./Navbar";
import Account from "../../../assets/account.svg";
import Question from "../../../assets/question.svg";
import About from "../../../assets/about.svg";
import Logout from "../../../assets/logout.svg";
import Accountdark from "../../../assets/accountdark.svg";
import Questiondark from "../../../assets/questiondark.svg";
import Aboutdark from "../../../assets/aboutdark.svg";
import Logoutdark from "../../../assets/logoutdark.svg";
import { logoutUser } from "../../utils/api";
import { useTheme } from "../../utils/ThemeContext";
import Sun from "../../../assets/sun.svg";
import Moon from "../../../assets/moon.svg";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../../utils/AuthContext";
import Save from "../../../assets/save.svg";
import Savedark from "../../../assets/savedark.svg";

const SettingsScreen = ({ navigation }) => {
  const { isDark, toggleTheme, themeColors } = useTheme();
  const customGradient = isDark
    ? ["#000000", "#8E1A7B"]
    : ["#FFFFFF", "#FFFFFF"];
  const customIconBack = isDark ? "#FFFFFF" : "#000000";
  const Themelogo = isDark ? Moon : Sun;
  const Accountlogo = isDark ? Accountdark : Account;
  const Questionlogo = isDark ? Questiondark : Question;
  const Aboutlogo = isDark ? Aboutdark : About;
  const Logoutlogo = isDark ? Logoutdark : Logout;
  const Savelogo = isDark ? Savedark : Save;

  const { setLoggedIn } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setLoggedIn(false);
    } catch (error) {
      Alert.alert("Logout Failed", error.message || "Try again later");
    }
  };

  const account = async () => {
    navigation.navigate("editprofile");
  };

    const saved = async () => {
    navigation.navigate("saved");
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={customGradient} style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={customIconBack} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: themeColors.line }]}>
            Settings
          </Text>
        </View>

        <View style={styles.settingbar}>
          <View style={styles.bars}>
            <Accountlogo width={20} height={20} />
            <TouchableOpacity onPress={account}>
              <Text style={[styles.text, { color: themeColors.line }]}>
                Account
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bars}>
            <Themelogo width={20} height={20} />
            <TouchableOpacity onPress={toggleTheme}>
              <Text style={[styles.text, { color: themeColors.line }]}>
                {isDark ? "Light" : "Dark"} Mode
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bars}>
            <Savelogo width={20} height={20} />
            <TouchableOpacity onPress={saved}>
              <Text style={[styles.text, { color: themeColors.line }]}>
                Saved
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bars}>
            <Questionlogo width={20} height={20} />
            <TouchableOpacity>
              <Text style={[styles.text, { color: themeColors.line }]}>
                Help & Support
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bars}>
            <Aboutlogo width={20} height={20} />
            <TouchableOpacity>
              <Text style={[styles.text, { color: themeColors.line }]}>
                About App
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bars}>
            <Logoutlogo width={20} height={20} />
            <TouchableOpacity onPress={handleLogout}>
              <Text style={[styles.text, { color: themeColors.line }]}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
      <Navbar />
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 12,
  },
  settingbar: {
    flexDirection: "column",
    width: 171,
    height: 162,
    top: 50,
    left: 27,
    gap: 23,
  },
  bars: {
    alignItems: "center",
    flexDirection: "row",
    gap: 17,
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
  },
});
