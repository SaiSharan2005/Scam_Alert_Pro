import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Modal,
} from "react-native";
import Navbar from "../pages/Navbar";
import PostCard from "../pages/PostCard";
import PlusButton from "./PlusButton";
import Settings from "../../../assets/settings.svg";
import Edit from "../../../assets/pencil.svg";
import Editdark from "../../../assets/editdark.svg";
import { Ionicons } from "@expo/vector-icons";
import {
  getProfile,
  BASE_URL,
  fetchMyComplaints,
  getUserProfileById,
  fetchComplaintFeedByUser,
  fetchLikedComplaint,
  followUser,
  unfollowUser,
} from "../../utils/api";
import { useRoute } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../../utils/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import ComplaintStatusScreen from "./ComplaintStatusScreen";

const ProfileScreen = ({ navigation }) => {
  const { isDark, themeColors } = useTheme();
  const customGradient = isDark
    ? ["#000000", "#8E1A7B"]
    : ["#FFFFFF", "#FFFFFF"];
  const customGradientpost = isDark
    ? ["#000000", "#8E1A7B"]
    : ["#8E1A7B", "#FFFFFF"];
  const Editlogo = isDark ? Editdark : Edit;

  const route = useRoute();
  const viewedUserId = route.params?.userId || null;
  const [currentUserId, setCurrentUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("Posts");
  const [activeMenuPostId, setActiveMenuPostId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [likedPosts, setLikedPosts] = useState([]);

  const isOwnProfile = !viewedUserId || viewedUserId === currentUserId;

  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalOpen, setImageModalOpen] = useState(false);

  const loadData = async () => {
    try {
      const myProfile = await getProfile();
      setCurrentUserId(myProfile.id);

      const userData =
        !viewedUserId || viewedUserId === myProfile.id
          ? myProfile
          : await getUserProfileById(viewedUserId);

      setUser(userData);
      setIsFollowing(userData.is_following ?? false);

      const userPosts =
        userData.id === myProfile.id
          ? await fetchMyComplaints()
          : await fetchComplaintFeedByUser(userData.id);

      setPosts(userPosts);

      if (isOwnProfile) {
        const myLiked = await fetchLikedComplaint();
        setLikedPosts(myLiked);
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

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(user.id);
      } else {
        await followUser(user.id);
      }
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error("Follow toggle failed:", err);
    }
  };

  const handleToggleMenu = (postId) => {
    setActiveMenuPostId((prev) => (prev === postId ? null : postId));
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Posts":
        return (
          <LinearGradient colors={customGradientpost} style={styles.gradient}>
            <View style={{ flex: 1 }}>
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
                      insideProfile={true}
                      onDelete={() => {
                        setPosts((prev) =>
                          prev.filter((p) => p.id !== item.id)
                        );
                      }}
                    />
                  )}
                  ListEmptyComponent={
                    !loading && (
                      <View style={styles.emptyContainer}>
                        <Ionicons
                          name="ComplaintsPost"
                          color={themeColors.text}
                          size={100}
                        />
                        <Text
                          style={[
                            styles.emptyText,
                            { color: themeColors.text },
                          ]}
                        >
                          No posts yet.
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
                      onRefresh={() => {
                        setRefreshing(true);
                        loadData();
                      }}
                    />
                  }
                />
              )}
            </View>
          </LinearGradient>
        );
      case "Liked":
        return (
          <LinearGradient colors={customGradientpost} style={styles.gradient}>
            <View style={{ flex: 1 }}>
              {loading ? (
                <ActivityIndicator
                  size="large"
                  color="red"
                  style={styles.loader}
                />
              ) : (
                <FlatList
                  data={likedPosts}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <PostCard
                      post={item}
                      isMenuOpen={activeMenuPostId === item.id}
                      onToggleMenu={() => handleToggleMenu(item.id)}
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
                          style={[
                            styles.emptyText,
                            { color: themeColors.text },
                          ]}
                        >
                          No liked posts yet.
                        </Text>
                      </View>
                    )
                  }
                  contentContainerStyle={
                    likedPosts.length === 0 ? styles.emptyFeed : styles.feed
                  }
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={() => {
                        setRefreshing(true);
                        loadData();
                      }}
                    />
                  }
                />
              )}
            </View>
          </LinearGradient>
        );

      case "Complaint Status":
        return <ComplaintStatusScreen />;
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={customGradient} style={styles.gradient}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => {
              setSelectedImage(`${BASE_URL}${user?.cover_image_url}`);
              setImageModalOpen(true);
            }}
          >
            <Image
              source={{ uri: `${BASE_URL}${user?.cover_image_url}` }}
              style={styles.headerBackground}
            />
          </TouchableOpacity>

          {isOwnProfile && (
            <TouchableOpacity
              onPress={() => navigation.navigate("settings")}
              style={styles.settingsIcon}
            >
              <Settings width={25} height={25} />
            </TouchableOpacity>
          )}

          <View style={styles.profileRow}>
            <TouchableOpacity
              onPress={() => {
                setSelectedImage(`${BASE_URL}${user?.profile_image_url}`);
                setImageModalOpen(true);
              }}
            >
              <Image
                source={{ uri: `${BASE_URL}${user?.profile_image_url}` }}
                style={[
                  styles.profileImage,
                  { borderColor: themeColors.profileborder },
                ]}
              />
            </TouchableOpacity>

            {isOwnProfile && (
              <TouchableOpacity
                style={[
                  styles.editButton,
                  { backgroundColor: themeColors.editbutton },
                ]}
                onPress={() => navigation.navigate("editprofile")}
              >
                <Text
                  style={[styles.editText, { color: themeColors.buttontext }]}
                >
                  Edit Profile
                </Text>
                <Editlogo width={14} height={14} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.userInfo}>
          <Text style={[styles.name, { color: themeColors.text }]}>
            {user?.username ?? ""}
          </Text>
          <Text style={[styles.bio, { color: themeColors.text }]}>
            {user?.bio ?? ""}
          </Text>
          <View style={styles.followsection}>
            <Text style={[styles.followInfo, { color: themeColors.text }]}>
              {user?.following ?? 0} Following • {user?.followers ?? 0}{" "}
              Followers
            </Text>

            <View>
              {!isOwnProfile && (
                <TouchableOpacity
                  onPress={handleFollowToggle}
                  style={{
                    backgroundColor: isFollowing ? "#ddd" : "#8E1A7B",
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    borderRadius: 20,
                    alignSelf: "center",
                    marginTop: 10,
                  }}
                >
                  <Text style={{ color: isFollowing ? "#000" : "#fff" }}>
                    {isFollowing ? "Following" : "Follow"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        <View style={styles.tabWrapper}>
          <View style={styles.tabRow}>
            {["Posts", "Liked", "Complaint Status"].map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[
                  styles.tabButton,
                  activeTab === tab && {
                    borderBottomColor: themeColors.borderbottom,
                  },
                ]}
              >
                <Text
                  style={[styles.tabButtonText, { color: themeColors.text }]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ flex: 1, bottom: 9 }}>{renderContent()}</View>

        <PlusButton />
        <Navbar />
        <Modal
          visible={isImageModalOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setImageModalOpen(false)}
        >
          <TouchableOpacity
            style={styles.fullScreenContainer}
            onPress={() => setImageModalOpen(false)}
            activeOpacity={1}
          >
            <Image
              source={{ uri: selectedImage }}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </Modal>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    height: 200,
    position: "relative",
  },

  headerBackground: {
    width: 402,
    height: 137,
    top: 49,
    resizeMode: "cover",
  },

  settingsIcon: {
    position: "absolute",
    top: 55,
    right: 16,
    zIndex: 2,
    padding: 6,
  },

  profileRow: {
    position: "absolute",
    top: 119,
    left: 26,
    flexDirection: "row",
    alignItems: "center",
    gap: 120,
    zIndex: 3,
  },

  profileImage: {
    width: 113,
    height: 113,
    borderRadius: 60,
    borderWidth: 5,
  },

  editButton: {
    flexDirection: "row",
    top: 30,
    gap: 5,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 10,
  },

  editText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },

  userInfo: {
    padding: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    top: 20,
    left: 5,
  },
  bio: {
    color: "#666",
    top: 18,
    left: 5,
  },
  followsection: {
    flexDirection: "row",
    gap: 50,
  },
  followInfo: {
    color: "#999",
    top: 18,
    left: 5,
  },
  placeholder: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
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
    gap: 10,
    paddingBottom: 100,
  },
  tabRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },

  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },

  tabButtonText: {
    fontSize: 13,
    fontWeight: "bold",
  },
  fullUnderline: {
    height: 2,
    backgroundColor: "#FFFFFF",
    width: "100%",
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },

  fullScreenImage: {
    width: "100%",
    height: "100%",
  },
});

export default ProfileScreen;
