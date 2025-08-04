import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { fetchComplaintById } from "../../utils/api";
import PostCard from "../pages/PostCard";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../utils/ThemeContext";

const PostDetailScreen = () => {
  const { isDark, themeColors } = useTheme();
  const customGradient = isDark
    ? ["#000000", "#8E1A7B"]
    : ["#FFFFFF00", "#8E1A7B"];
  const customIconBack = isDark ? "#FFFFFF" : "#000000";

  const route = useRoute();
  const navigation = useNavigation();
  const { postId } = route.params;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const data = await fetchComplaintById(postId);
        setPost(data);
      } catch (err) {
        console.error("Failed to load post:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [postId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="red" />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.center}>
        <Text>Post not found.</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={customGradient} style={styles.gradient}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.back}
        >
          <Ionicons name="arrow-back" size={24} color={customIconBack} />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={{ padding: 10 }}>
          <PostCard
            post={post}
            insideProfile={false}
            isMenuOpen={openMenuId === post.id}
            onToggleMenu={() =>
              setOpenMenuId(openMenuId === post.id ? null : post.id)
            }
            onDelete={() => {
              navigation.goBack();
            }}
          />
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

export default PostDetailScreen;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    alignItems: "center",
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
