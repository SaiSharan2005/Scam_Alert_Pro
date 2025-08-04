import React, { useRef, useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { verifyOtp, resendOtp } from "../../utils/api";
import { AuthContext } from "../../utils/AuthContext";
import { useTheme } from "../../utils/ThemeContext";

export default function OtpLoginScreen({ navigation, route }) {
  const { email } = route.params;
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const { setLoggedIn } = useContext(AuthContext);
  const inputs = useRef([]);

  const { isDark, themeColors } = useTheme();
  const customGradient = isDark
    ? ["#000000", "#8E1A7B"]
    : ["#FFFFFF00", "#8E1A7B"];
  const customIconBack = isDark ? "#FFFFFF" : "#000000";

  const handleChange = (text, index) => {
    if (/^\d+$/.test(text)) {
      if (text.length === 6) {
        const updatedOtp = text.split("").slice(0, 6);
        setOtp(updatedOtp);
        inputs.current[5].blur();
      } else {
        const updatedOtp = [...otp];
        updatedOtp[index] = text;
        setOtp(updatedOtp);

        if (index < 5 && text !== "") {
          inputs.current[index + 1].focus();
        }
      }
    } else if (text === "") {
      const updatedOtp = [...otp];
      updatedOtp[index] = "";
      setOtp(updatedOtp);

      if (index > 0) {
        inputs.current[index - 1].focus();
      }
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      Alert.alert("Invalid OTP", "Please enter the full 6-digit code.");
      return;
    }

    setLoading(true);
    try {
      const result = await verifyOtp(email, otpCode);
      if (route.params?.routeFrom === "forgotpassword") {
        navigation.replace("resetpassword", { email });
      } else {
        setLoggedIn(true);
      }
    } catch (err) {
      Alert.alert("OTP Failed", err.message || "Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={customGradient} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color={customIconBack} />
        </TouchableOpacity>
        <View>
          <Text style={[styles.title, { color: themeColors.text }]}>OTP</Text>
          <Text style={[styles.subtitle, { color: themeColors.text }]}>
            Verification Code
          </Text>
          <Text style={[styles.description, { color: themeColors.text }]}>
            We have sent the code to {email}
          </Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputs.current[index] = ref)}
                style={styles.otpInput}
                maxLength={1}
                keyboardType="number-pad"
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
              />
            ))}
          </View>

          <Text style={styles.resendText}>
            Didn’t receive a code?{" "}
            <Text
              style={[styles.resendLink, { color: themeColors.line }]}
              onPress={async () => {
                try {
                  await resendOtp(email);
                  Alert.alert(
                    "OTP Sent",
                    "A new OTP has been sent to your email."
                  );
                } catch (err) {
                  Alert.alert("Resend Failed", err.message || "Try again.");
                }
              }}
            >
              Resend code
            </Text>
          </Text>

          <TouchableOpacity style={styles.buttonWrapper} onPress={handleVerify}>
            <LinearGradient
              colors={["#905101", "#EB9E3C"]}
              style={styles.button}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Confirm</Text>
              )}
            </LinearGradient>
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
    padding: 24,
    paddingTop: 70,
    flexGrow: 1,
  },
  backBtn: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 4,
  },
  description: {
    textAlign: "center",
    marginTop: 10,
    marginBottom: 30,
    fontWeight:"400",
    fontSize:14
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 20,
  },
  otpInput: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#F3F3F3",
    textAlign: "center",
    fontSize: 18,
    color: "#000",
  },
  resendText: {
    textAlign: "center",
    fontSize: 14,
    color: "#6C7278",
    marginBottom: 24,
  },
  resendLink: {
    fontWeight: "600",
  },
  buttonWrapper: {
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
