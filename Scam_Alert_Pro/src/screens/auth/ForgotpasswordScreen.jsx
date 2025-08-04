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
import Logodark from "../../../assets/scamlogo2.png";
import { resendOtp } from "../../utils/api";

const ForgotpasswordScreen = ({ navigation }) => {
  const { isDark, themeColors } = useTheme();
  const customGradient = isDark
    ? ["#000000", "#8E1A7B"]
    : ["#8E1A7B", "#FFFFFF00"];
  const LogoPic = isDark ? Logodark : Logo;
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert("Validation", "Please enter your email");
      return;
    }

    setLoading(true);
    try {
      await resendOtp(email); 
      navigation.navigate("otplogin", { email, routeFrom: "forgotpassword" });
    } catch (err) {
      Alert.alert(
        "Error",
        err?.response?.data?.message || "Something went wrong"
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
            Forgot Password
          </Text>

          <Text
            style={[styles.subtitle, { color: themeColors.customsubtitle }]}
          >
            Enter your email address
          </Text>
          <TextInput
            placeholder="Enter email address"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
          />
          <TouchableOpacity style={styles.buttonWrapper} onPress={handleSubmit}>
            <LinearGradient
              colors={["#905101", "#EB9E3C"]}
              style={styles.button}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Continue</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default ForgotpasswordScreen;

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
    gap: 10,
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
    marginBottom: 20,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    backgroundColor: "#fff",
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
