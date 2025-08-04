import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Logo from "../../../assets/scamlogo.png";
import Logodark from "../../../assets/scamlogo2.png";
import Googleicon from "../../../assets/google-icon-logo-svgrepo-com.svg";
import Facebookicon from "../../../assets/facebook-3-logo-svgrepo-com.svg";
import { loginUser } from "../../utils/api";
import { useTheme } from "../../utils/ThemeContext";

export default function LoginScreen({ navigation }) {
  const { isDark, themeColors } = useTheme();
  const customGradient = isDark
    ? ["#000000", "#8E1A7B"]
    : ["#8E1A7B","#FFFFFF00"];
  const LogoPic = isDark ? Logodark : Logo;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await loginUser(email, password);

      if (remember) {
        await AsyncStorage.setItem("rememberMe", "true");
        await AsyncStorage.setItem("rememberedEmail", email);
        await AsyncStorage.setItem("rememberedPassword", password);
      } else {
        await AsyncStorage.removeItem("rememberMe");
        await AsyncStorage.removeItem("rememberedEmail");
        await AsyncStorage.removeItem("rememberedPassword");
      }

      navigation.navigate("otplogin", { email });
    } catch (err) {
      Alert.alert("Login Failed", err.message || "Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadRemembered = async () => {
      const remembered = await AsyncStorage.getItem("rememberMe");
      const savedEmail = await AsyncStorage.getItem("rememberedEmail");
      const savedPassword = await AsyncStorage.getItem("rememberedPassword");

      if (remembered === "true" && savedEmail && savedPassword) {
        setEmail(savedEmail);
        setPassword(savedPassword);
        setRemember(true);
      }
    };
    loadRemembered();
  }, []);

  return (
    <LinearGradient colors={customGradient} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={LogoPic} style={styles.logo} resizeMode="contain" />

        <View
          style={[
            styles.card,
            { backgroundColor: themeColors.logincontainer },
            { borderColor: themeColors.loginborder },
          ]}
        >
          <Text style={[styles.title, { color: themeColors.text }]}>Login</Text>
          <Text style={styles.subtitle}>
            Don’t have an account?
            <Text
              style={styles.link}
              onPress={() => navigation.navigate("signup")}
            >
              Sign Up
            </Text>
          </Text>
          <Text style={styles.textnames}>Email</Text>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
          />
          <Text style={styles.textnames}>Password</Text>
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

          <View style={styles.rememberRow}>
            <TouchableOpacity
              onPress={() => setRemember(!remember)}
              style={styles.checkboxRow}
            >
              <MaterialIcons
                name={remember ? "check-box" : "check-box-outline-blank"}
                size={20}
                color={remember ? "#4D81E7" : "#888"}
              />
              <Text style={styles.checkboxLabel}>Remember me</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("forgotpassword")}>
              <Text style={styles.forgotLink}>Forgot Password ?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.buttonWrapper} onPress={handleLogin}>
            <LinearGradient
              colors={["#905101", "#EB9E3C"]}
              style={styles.button}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.mainline}>
            <View style={styles.line} />
            <Text style={styles.or}>Or</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity style={styles.socialButton}>
            <Googleicon width={18} height={18} />
            <Text style={styles.socialText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton}>
            <Facebookicon width={18} height={18} />
            <Text style={styles.socialText}>Continue with Facebook</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    alignItems: "center",
    padding: 24,
    paddingTop: 70,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  card: {
    borderRadius: 15,
    padding: 20,
    gap: 8,
    width: "100%",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    color: "#6C7278",
    marginBottom: 20,
    fontSize: 14,
  },
  link: {
    color: "#4D81E7",
    fontWeight: "600",
  },
  textnames: {
    color: "#6C7278",
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
  rememberRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    alignItems: "center",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
  },
  forgotLink: {
    color: "#4D81E7",
    fontSize: 14,
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
  mainline: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
  },
  line: {
    width: 120,
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  or: {
    textAlign: "center",
    color: "#666",
    marginVertical: 12,
    fontSize: 12,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    marginBottom: 12,
    elevation: 2,
  },
  socialText: {
    marginLeft: 12,
    textAlign: "center",
    color: "#333",
    fontWeight: "500",
  },
});
