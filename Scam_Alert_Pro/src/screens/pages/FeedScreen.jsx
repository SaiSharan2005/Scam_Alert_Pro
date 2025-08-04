import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Dimensions,
  RefreshControl,
  Text,
} from "react-native";
import Navbar from "../pages/Navbar";
import PostCard from "../pages/PostCard";
import { LinearGradient } from "expo-linear-gradient";
import PlusButton from "./PlusButton";
import { marqueepost, fetchComplaintFeed } from "../../utils/api";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../../utils/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

const FeedScreen = () => {
  const { isDark, themeColors } = useTheme();
  const customGradient = isDark
    ? ["#000000", "#8E1A7B"]
    : ["#8E1A7B", "#FFFFFF"];
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const translateX = useRef(new Animated.Value(screenWidth)).current;
  const [marquee, setMarquee] = useState("");
  const [followStatusMap, setFollowStatusMap] = useState({});
  const [activeMenuPostId, setActiveMenuPostId] = useState(null);

  const handleFollowToggle = (userId, isNowFollowing) => {
    setFollowStatusMap((prev) => ({
      ...prev,
      [userId]: isNowFollowing,
    }));
  };

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const message = await marqueepost();
        setMarquee(message);
      } catch (err) {
        console.error("Error fetching emergency message:", err);
      }
    };

    fetchNotification();
  }, []);

  useEffect(() => {
    const scroll = () => {
      translateX.setValue(screenWidth);
      Animated.timing(translateX, {
        toValue: -screenWidth,
        duration: 8000,
        useNativeDriver: true,
      }).start(() => scroll());
    };

    scroll();
  }, [translateX]);
  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await fetchComplaintFeed();
      setPosts(data);
    } catch (err) {
      console.error("Failed to load complaints:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPosts();
    }, [])
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  }, []);

  const handleToggleMenu = (postId) => {
    setActiveMenuPostId((prev) => (prev === postId ? null : postId));
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <LinearGradient colors={customGradient} style={styles.gradient}>
          <View style={styles.marqueecontainer}>
            <Animated.Text
              style={[styles.marqueetext, { transform: [{ translateX }] }]}
            >
              {marquee || "Beware of Scams"}
            </Animated.Text>
          </View>

          <View>
            {loading ? (
              <ActivityIndicator
                size="large"
                color="red"
                style={styles.loader}
              />
            ) : (
              <FlatList
                data={posts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <PostCard
                    post={item}
                    isMenuOpen={activeMenuPostId === item.id}
                    onToggleMenu={() => handleToggleMenu(item.id)}
                    onDelete={() => {
                      setPosts((prev) => prev.filter((p) => p.id !== item.id));
                    }}
                    onFollowToggle={handleFollowToggle}
                    globalIsFollowing={followStatusMap[item.user.id]}
                  />
                )}
                ListEmptyComponent={
                  !loading && (
                    <View style={styles.emptyContainer}>
                      <Ionicons
                        name="heart"
                        color={themeColors.text}
                        size={100}
                      />
                      <Text
                        style={[styles.emptyText, { color: themeColors.text }]}
                      >
                        No liked posts yet.
                      </Text>
                    </View>
                  )
                }
                contentContainerStyle={
                  posts.length === 0 ? styles.emptyFeed : styles.feed
                }
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                  />
                }
              />
            )}
          </View>
        </LinearGradient>
      </View>
      <PlusButton />
      <Navbar />
    </View>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    top: 40,
  },
  container: {
    flex: 1,
  },

  marqueecontainer: {
    backgroundColor: "#000000",
    width: 1020,
    height: 38,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    padding: 10,
    gap: 10,
    overflow: "hidden",
    justifyContent: "center",
  },
  marqueetext: {
    width: 1000,
    height: 18,
    color: "#FFFFFF",
    fontWeight: "900",
    fontStyle: "italic",
    fontSize: 17.15,
    lineHeight: 17.15,
    verticalAlign: "middle",
    letterSpacing: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    gap: 5,
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
    paddingBottom: 150,
  },
});

export default FeedScreen;
