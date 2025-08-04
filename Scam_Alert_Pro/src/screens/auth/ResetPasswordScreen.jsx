import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useTheme } from "../../utils/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import Logo from "../../../assets/scamlogo.png";
import { Ionicons } from "@expo/vector-icons";
import Logodark from "../../../assets/scamlogo2.png";
import { resetPassword } from "../../utils/api";

const ResetPasswordScreen = ({ navigation, route }) => {
  const { isDark, themeColors } = useTheme();
  const customGradient = isDark
    ? ["#000000", "#8E1A7B"]
    : ["#8E1A7B", "#FFFFFF00"];
  const LogoPic = isDark ? Logodark : Logo;
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showMismatch, setShowMismatch] = useState(false);

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      Alert.alert("Validation", "Please enter both fields");
      return;
    }

    if (password !== confirmPassword) {
      setShowMismatch(true);
      return;
    }

    setShowMismatch(false);

    setLoading(true);
    try {
      await resetPassword(route.params.email, password);
      Alert.alert("Success", "Password reset successfully. Please login.");
      navigation.replace("login");
    } catch (err) {
      Alert.alert(
        "Error",
        err?.response?.data?.message || "Failed to reset password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={customGradient} style={styles.gradient}>
      <View style={styles.container}>
        <Image source={LogoPic} resizeMode="contain" style={styles.logo} />
        <View
          style={[
            styles.card,
            { backgroundColor: themeColors.logincontainer },
            { borderColor: themeColors.loginborder },
          ]}
        >
          <Text style={[styles.title, { color: themeColors.text }]}>
            New Password
          </Text>

          <View
            style={[
              styles.subtitlecard,
              { backgroundColor: showMismatch ? "#FF8269" : "#BBF0C8" },
            ]}
          >
            <Text
              style={[
                styles.subtitle,
                { color: showMismatch ? "#FFFFFF" : "#4A7B68" },
              ]}
            >
              {showMismatch
                ? "The password you typed is not same, please check the password"
                : "Please Create a new password that you don’t use on any other site"}
            </Text>
          </View>

          <View style={styles.inputIcon}>
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={secureText}
              style={styles.flexInput}
            />
            <TouchableOpacity onPress={() => setSecureText(!secureText)}>
              <Ionicons
                name={secureText ? "eye-off" : "eye"}
                size={20}
                color="#888"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.inputIcon}>
            <TextInput
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={secureText}
              style={styles.flexInput}
            />
            <TouchableOpacity onPress={() => setSecureText(!secureText)}>
              <Ionicons
                name={secureText ? "eye-off" : "eye"}
                size={20}
                color="#888"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.buttonWrapper}
            onPress={handleResetPassword}
          >
            <LinearGradient
              colors={["#905101", "#EB9E3C"]}
              style={styles.button}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Reset Password</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    alignItems: "center",
    padding: 24,
    paddingTop: 120,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  card: {
    borderRadius: 15,
    padding: 20,
    gap: 15,
    width: "100%",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  subtitlecard: {
    borderRadius: 15,
    width: "90%",
    left: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    fontSize: 14,
    padding: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  inputIcon: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  flexInput: {
    flex: 1,
    paddingVertical: 14,
  },
  buttonWrapper: {
    marginTop: 8,
    borderRadius: 10,
    overflow: "hidden",
  },
  button: {
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
