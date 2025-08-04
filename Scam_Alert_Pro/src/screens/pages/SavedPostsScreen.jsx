import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import Navbar from "./Navbar";
import PostCard from "../pages/PostCard";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../utils/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { useRoute } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { fetchSavedComplaint } from "../../utils/api";

const SettingsScreen = ({ navigation }) => {
  const route = useRoute();
  const viewedUserId = route.params?.userId || null;

  const { isDark, themeColors } = useTheme();
  const customGradient = isDark
    ? ["#000000", "#8E1A7B"]
    : ["#FFFFFF", "#FFFFFF"];
  const customIconBack = isDark ? "#FFFFFF" : "#000000";
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);

  const isOwnProfile = !viewedUserId || viewedUserId === currentUserId;

  const loadData = async () => {
    try {
      if (isOwnProfile) {
        const mySaved = await fetchSavedComplaint();
        setSavedPosts(mySaved);
      }
    } catch (err) {
      console.error("Failed to load profile or posts:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [viewedUserId])
  );

  useEffect(() => {
    loadData();
  }, [viewedUserId]);

  return (
    <View style={styles.container}>
      <LinearGradient colors={customGradient} style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={customIconBack} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: themeColors.line }]}>
            Saved
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          {loading ? (
            <ActivityIndicator size="large" color="red" style={styles.loader} />
          ) : (
            <FlatList
              data={savedPosts}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <PostCard
                  post={item}
                  isMenuOpen={openMenuId === item.id}
                  onToggleMenu={() =>
                    setOpenMenuId(openMenuId === item.id ? null : item.id)
                  }
                />
              )}
              ListEmptyComponent={
                !loading && (
                  <View style={styles.emptyContainer}>
                    <Ionicons
                      name="bookmark"
                      color={themeColors.text}
                      size={100}
                    />
                    <Text
                      style={[styles.emptyText, { color: themeColors.text }]}
                    >
                      No saved posts yet.
                    </Text>
                  </View>
                )
              }
              contentContainerStyle={
                savedPosts.length === 0 ? styles.emptyFeed : styles.feed
              }
            />
          )}
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    gap:5
  },

  emptyText: {
    fontSize: 16,
    textAlign: "center",
  },

  emptyFeed: {
    flexGrow: 1,
    justifyContent: "center",
  },
  feed: {
    gap: 10,
    paddingBottom: 100,
  },
});
