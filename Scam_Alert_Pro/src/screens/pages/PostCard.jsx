import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Modal,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Share,
  Animated,
  Alert,
  TouchableWithoutFeedback,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import Comment from "../../../assets/comment.svg";
import Commentdark from "../../../assets/commentdark.svg";
import Heart from "../../../assets/heart.svg";
import Heartdark from "../../../assets/heartdark.svg";
import Repost from "../../../assets/repost.svg";
import Repostdark from "../../../assets/repostdark.svg";
import Save from "../../../assets/save.svg";
import Savedark from "../../../assets/savedark.svg";
import AudioPlayer from "../../utils/AudioPlayer";
import {
  BASE_URL,
  getProfile,
  likePost,
  unlikePost,
  savePost,
  unsavePost,
  followUser,
  unfollowUser,
  repost,
  getComments,
  addComment,
  deleteComplaint,
} from "../../utils/api";
import { useVideoPlayer, VideoView } from "expo-video";
import { useTheme } from "../../utils/ThemeContext";

const PostCard = ({
  post,
  isMenuOpen,
  onToggleMenu,
  insideProfile = false,
  onDelete,
  onFollowToggle,
  globalIsFollowing,
}) => {
  const navigation = useNavigation();
  const { isDark, themeColors } = useTheme();
  const customGradient = isDark
    ? ["#FFFFFF", "#FFFFFF"]
    : ["#905101", "#EB9E3C"];
  const customIcon = isDark ? "#FFFFFF" : "#000000";
  const Heartlogo = isDark ? Heartdark : Heart;
  const Commentlogo = isDark ? Commentdark : Comment;
  const Repostlogo = isDark ? Repostdark : Repost;
  const Savelogo = isDark ? Savedark : Save;

  const [isLiked, setIsLiked] = useState(!!post.liked);
  const [isSaved, setIsSaved] = useState(!!post.saved);
  const [isFollowing, setIsFollowing] = useState(!!post.user?.is_following);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [repostCount, setRepostCount] = useState(post.reposts || 0);

  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const [currentUserId, setCurrentUserId] = useState(null);
  const isOwnPost = currentUserId === post.user.id;

  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalOpen, setImageModalOpen] = useState(false);

  const [feedbackText, setFeedbackText] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleNavigateToProfile = () => {
    navigation.navigate("profile", { userId: post.user.id });
  };

  useEffect(() => {
    if (typeof globalIsFollowing === "boolean") {
      setIsFollowing(globalIsFollowing);
    }
  }, [globalIsFollowing]);

  const VideoPlayer = ({ uri }) => {
    const player = useVideoPlayer(uri, (player) => {
      player.loop = true;
    });

    return (
      <VideoView
        style={styles.postImage}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
        useNativeControls
        resizeMode="contain"
      />
    );
  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(post.user.id);
      } else {
        await followUser(post.user.id);
      }

      const updatedStatus = !isFollowing;
      setIsFollowing(updatedStatus);

      onFollowToggle?.(post.user.id, updatedStatus);
    } catch (err) {
      console.error("Follow error:", err);
    }
  };

  const handleLike = async () => {
    const baseId =
      typeof post.id === "string" ? post.id.split("-")[0] : post.id;
    try {
      if (isLiked) {
        await unlikePost(baseId);
        setLikeCount((prev) => prev - 1);
      } else {
        await likePost(baseId);
        setLikeCount((prev) => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const loadComments = async () => {
    try {
      const data = await getComments(post.id);
      setComments(data);
    } catch (err) {
      console.error("Fetch comments error:", err);
    }
  };

  const handleAddComment = async () => {
    const baseId =
      typeof post.id === "string" ? post.id.split("-")[0] : post.id;
    if (!newComment.trim()) return;

    try {
      await addComment(baseId, newComment);
      setNewComment("");
      loadComments();
    } catch (err) {
      console.error("Add comment error:", err);
    }
  };

  const handleSave = async () => {
    const baseId =
      typeof post.id === "string" ? post.id.split("-")[0] : post.id;
    try {
      if (isSaved) {
        await unsavePost(baseId);
        setFeedbackText("Unsaved");
      } else {
        await savePost(baseId);
        setFeedbackText("Saved");
      }
      setIsSaved(!isSaved);

      // Fade in the feedback
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2000), // Stay visible
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleRepost = async () => {
    navigation.navigate("post", {
      post,
      isRepost: true,
    });
  };

  const handleDelete = () => {
    Alert.alert(
      post.reposted_by_user_id === currentUserId
        ? "Delete Repost"
        : "Delete Post",
      post.reposted_by_user_id === currentUserId
        ? "Are you sure you want to undo your repost?"
        : "Are you sure you want to delete your post?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteComplaint(post.id);
              Alert.alert(
                post.reposted_by_user_id === currentUserId
                  ? "Repost deleted"
                  : "Post deleted"
              );

              if (typeof onToggleMenu === "function") {
                onToggleMenu();
                onDelete?.();
              }
            } catch (err) {
              console.error("Delete error:", err);
              Alert.alert("Error", "Could not delete the post.");
            }
          },
        },
      ]
    );
  };

  const handleShare = async () => {
    try {
      const text = post.text_content || "Check out this post!";
      const url =
        post.files && post.files.length > 0
          ? `${BASE_URL}/${post.files[0].file_url.replace(/\\/g, "/")}`
          : "";

      const message = url ? `${text}\n${url}` : text;

      await Share.share({
        message,
      });

      onToggleMenu();
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const profile = await getProfile();
        setCurrentUserId(profile.id);
      } catch (err) {
        console.error("Failed to load user profile", err);
      }
    };

    fetchUser();
  }, []);

  return (
    <View style={[styles.card, { backgroundColor: themeColors.card }]}>
      <View style={styles.header}>
        <View style={styles.subheader}>
          <TouchableOpacity onPress={handleNavigateToProfile}>
            <Image
              source={{ uri: BASE_URL + post.user.profile_image_url }}
              style={styles.avatar}
            />
          </TouchableOpacity>
          <View style={styles.usermain}>
            <View style={styles.userInfo}>
              <TouchableOpacity onPress={handleNavigateToProfile}>
                <Text
                  style={[styles.name, { color: themeColors.text }]}
                >{`${post.user.first_name} ${post.user.last_name}`}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleNavigateToProfile}>
                <Text style={[styles.username, { color: themeColors.text }]}>
                  @{post.user.username}
                </Text>
              </TouchableOpacity>
              {!insideProfile &&
                currentUserId !== null &&
                currentUserId !== post.user.id &&
                !isFollowing && (
                  <TouchableOpacity
                    onPress={handleFollow}
                    style={styles.callButton}
                  >
                    <LinearGradient
                      colors={customGradient}
                      style={styles.gradientButton}
                    >
                      <Text
                        style={[
                          styles.buttonText,
                          { color: themeColors.buttontext },
                        ]}
                      >
                        Follow
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
            </View>
            {post.reposted_by_user_id &&
              post.reposted_by_user_id !== post.user.id && (
                <Text style={[styles.repostTag, { color: themeColors.text }]}>
                  🔁 Reposted by you
                </Text>
              )}
            <Text style={[styles.description, { color: themeColors.text }]}>
              {post.text_content}
            </Text>

            {post.files?.map((file, index) => {
              const uri = `${BASE_URL}/${file.file_url
                .replace(/\\/g, "/")
                .replace(/^\/?/, "")}`;

              switch (file.file_type) {
                case "image":
                  return (
                    <TouchableOpacity
                      key={`img-${index}`}
                      onPress={() => {
                        setSelectedImage(uri);
                        setImageModalOpen(true);
                      }}
                    >
                      <Image
                        source={{ uri }}
                        style={styles.postImage}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  );
                case "video":
                  return <VideoPlayer key={`vid-${index}`} uri={uri} />;
                case "audio":
                  return (
                    <View key={`aud-${index}`} style={styles.audioBox}>
                      <AudioPlayer uri={uri} />
                    </View>
                  );
                default:
                  return (
                    <TouchableOpacity
                      key={`doc-${index}`}
                      onPress={() => Linking.openURL(uri)}
                      style={[
                        styles.docBox,
                        { backgroundColor: themeColors.profileborder },
                      ]}
                    >
                      <Text style={[styles.buttonText, {color:themeColors.buttontext}]}>Document</Text>
                    </TouchableOpacity>
                  );
              }
            })}
          </View>
        </View>

        <TouchableOpacity onPress={onToggleMenu}>
          <Feather name="more-vertical" size={20} color={customIcon} />
        </TouchableOpacity>

        {isMenuOpen && (
          <TouchableWithoutFeedback onPress={onToggleMenu}>
            <View style={styles.menuOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.menu}>
                  {isOwnPost ? (
                    <>
                      <TouchableOpacity
                        onPress={() => {
                          onToggleMenu();
                          navigation.navigate("post", { post });
                        }}
                      >
                        <Text style={styles.menuItem}>Edit</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          onToggleMenu();
                          handleDelete();
                        }}
                      >
                        <Text style={styles.menuItem}>Delete</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          onToggleMenu();
                          handleShare();
                        }}
                      >
                        <Text style={styles.menuItem}>Share</Text>
                      </TouchableOpacity>
                    </>
                  ) : post.reposted_by_user_id === currentUserId ? (
                    <>
                      <TouchableOpacity
                        onPress={() => {
                          onToggleMenu();
                          handleDelete();
                        }}
                      >
                        <Text style={styles.menuItem}>Undo</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          onToggleMenu();
                          handleShare();
                        }}
                      >
                        <Text style={styles.menuItem}>Share</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <TouchableOpacity
                        onPress={() => {
                          onToggleMenu();
                          handleNavigateToProfile();
                        }}
                      >
                        <Text style={styles.menuItem}>View Profile</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          onToggleMenu();
                          handleShare();
                        }}
                      >
                        <Text style={styles.menuItem}>Share</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={handleLike}>
          <Heartlogo width={19} height={19} />
        </TouchableOpacity>
        <Text style={[styles.actioncolor, { color: themeColors.text }]}>
          {likeCount}
        </Text>

        <TouchableOpacity
          onPress={() => {
            setIsCommentsOpen(true);
            loadComments();
          }}
        >
          <Commentlogo width={19} height={19} />
        </TouchableOpacity>
        <Text style={[styles.actioncolor, { color: themeColors.text }]}>
          {post.comments}
        </Text>

        <TouchableOpacity onPress={handleRepost}>
          <Repostlogo width={19} height={19} />
        </TouchableOpacity>
        <Text style={[styles.actioncolor, { color: themeColors.text }]}>
          {repostCount}
        </Text>

        <TouchableOpacity onPress={handleSave}>
          <Savelogo width={19} height={19} />
        </TouchableOpacity>
      </View>

      <Modal
        visible={isCommentsOpen}
        animationType="slide"
        onRequestClose={() => setIsCommentsOpen(false)}
        transparent
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.commentModal}>
            <Text style={styles.modalTitle}>Comments</Text>
            <FlatList
              data={comments}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.commentItem}>
                  <Text style={styles.commentUser}>{item.username}:</Text>
                  <Text style={styles.commentText}>{item.text}</Text>
                </View>
              )}
            />

            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              keyboardVerticalOffset={80}
              style={styles.commentInputRow}
            >
              <TextInput
                value={newComment}
                onChangeText={setNewComment}
                placeholder="Add a comment..."
                style={styles.commentInput}
              />
              <TouchableOpacity onPress={handleAddComment}>
                <Text style={styles.sendButton}>Send</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>

            <TouchableOpacity
              onPress={() => setIsCommentsOpen(false)}
              style={styles.closeButton}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isImageModalOpen}
        transparent={true}
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
      <Animated.Text
        style={{
          color: themeColors.text,
          left: 160,
          bottom: 5,
          marginTop: 2,
          fontWeight: "700",
          opacity: fadeAnim,
        }}
      >
        {feedbackText}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 370,
    marginVertical: 8,
    alignSelf: "center",
    borderRadius: 14.85,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
    alignItems: "flex-start",
  },
  subheader: {
    flexDirection: "row",
    gap: 8,
    flex: 1,
  },
  avatar: { width: 37, height: 37, borderRadius: 20 },
  usermain: { flex: 1 },
  userInfo: { flexDirection: "row", gap: 5, alignItems: "center" },
  name: { fontWeight: "700", fontSize: 14 },
  username: { color: "gray", fontSize: 14 },
  description: {
    marginVertical: 6,
    fontSize: 14,
  },
  postImage: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    marginTop: 8,
  },
  audioBox: {
    marginTop: 10,
    width: "100%",
  },
  audioPlayer: {
    height: 60,
    width: "100%",
    marginTop: 4,
  },
  audioPlayer: {
    marginTop: 4,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },

  docBox: {
    marginTop: 10,
    width: "40%",
    height: 35,
    left: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 6,
  },
  docLink: {
    color: "#007bff",
    fontSize: 14,
  },
  actions: {
    flexDirection: "row",
    gap: 25,
    padding: 10,
    left: 60,
  },
  actioncolor: {
    right: 8,
  },
  menuOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    zIndex: 999,
  },

  menu: {
    position: "absolute",
    top: 30,
    right: 15,
    width: 100,
    backgroundColor: "#D9D9D9",
    borderRadius: 8,
    padding: 10,
    elevation: 4,
    zIndex: 10,
  },
  menuItem: {
    paddingVertical: 8,
    textAlign:"center",
    fontSize: 14,
    fontWeight:"700",
    color: "#333",
  },
  callButton: {
    flex: 1,
    marginHorizontal: 5,
  },

  gradientButton: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 10,
  },

  buttonText: {
    fontWeight: "bold",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  commentModal: {
    backgroundColor: "white",
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  commentItem: {
    flexDirection: "row",
    marginVertical: 6,
  },
  commentUser: {
    fontWeight: "bold",
    marginRight: 6,
  },
  commentText: {
    flexShrink: 1,
  },
  commentInputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
  },
  sendButton: {
    color: "#EB9E3C",
    fontWeight: "bold",
  },
  closeButton: {
    alignSelf: "center",
    marginTop: 10,
    backgroundColor: "#EB9E3C",
    padding: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
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

export default PostCard;
