import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StartScreen from "./src/screens/auth/StartScreen";
import LoginScreen from "./src/screens/auth/LoginScreen";
import SignupScreen from "./src/screens/auth/SignupScreen";
import OtpLoginScreen from "./src/screens/auth/OtpLoginScreen";
import ForgotpasswordScreen from "./src/screens/auth/ForgotpasswordScreen";
import FeedScreen from "./src/screens/pages/FeedScreen";
import SearchScreen from "./src/screens/pages/SearchScreen";
import NotificationsScreen from "./src/screens/pages/NotificationsScreen";
import EmergencyScreen from "./src/screens/pages/EmergencyScreen";
import ProfileScreen from "./src/screens/pages/ProfileScreen";
import ProfileUpdateScreen from "./src/screens/pages/ProfileUpdateScreen";
import SettingsScreen from "./src/screens/pages/SettingsScreen";
import UserPostCard from "./src/screens/pages/UserPostCard";
import PostDetailScreen from "./src/screens/pages/PostDetailScreen";
import { getToken } from "./src/utils/api";
import { ActivityIndicator, View } from "react-native";
import { AuthContext } from "./src/utils/AuthContext";
import { ThemeProvider } from "./src/utils/ThemeContext";
import ResetPasswordScreen from "./src/screens/auth/ResetPasswordScreen";
import SavedPostsScreen from "./src/screens/pages/SavedPostsScreen"
const Stack = createNativeStackNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="start" component={StartScreen} />
    <Stack.Screen name="login" component={LoginScreen} />
    <Stack.Screen name="signup" component={SignupScreen} />
    <Stack.Screen name="otplogin" component={OtpLoginScreen} />
    <Stack.Screen name="forgotpassword" component={ForgotpasswordScreen} />
    <Stack.Screen name="resetpassword" component={ResetPasswordScreen} />
  </Stack.Navigator>
);

const AppStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="dashboard" component={FeedScreen} />
    <Stack.Screen name="search" component={SearchScreen} />
    <Stack.Screen name="notifications" component={NotificationsScreen} />
    <Stack.Screen name="emergency" component={EmergencyScreen} />
    <Stack.Screen name="profile" component={ProfileScreen} />
    <Stack.Screen name="editprofile" component={ProfileUpdateScreen} />
    <Stack.Screen name="settings" component={SettingsScreen} />
    <Stack.Screen name="post" component={UserPostCard} />
    <Stack.Screen name="postdetails" component={PostDetailScreen} />
    <Stack.Screen name="saved" component={SavedPostsScreen} />
  </Stack.Navigator>
);

export default function App() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = await getToken();
      const remember = await AsyncStorage.getItem("rememberMe");

      if (token && remember === "true") {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }

      setLoading(false);
    };
    checkToken();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#8E1A7B" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <AuthContext.Provider value={{ loggedIn, setLoggedIn }}>
        <NavigationContainer>
          {loggedIn ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}
