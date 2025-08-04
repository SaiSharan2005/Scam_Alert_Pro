import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import {
  BASE_URL,
  fetchNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead
} from "../../utils/api";
import Navbar from "./Navbar";
import { useTheme } from "../../utils/ThemeContext";

const timeAgo = (timestamp) => {
  const diff = (new Date() - new Date(timestamp)) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const NotificationsScreen = () => {
  const { isDark, themeColors } = useTheme();
  const customGradient = isDark
    ? ["#000000", "#8E1A7B"]
    : ["#FFFFFF", "#FFFFFF"];
  const customIconBack = isDark ? "#FFFFFF" : "#000000";
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState({
    new: [],
    today: [],
    earlier: [],
  });
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotifications = async (nextPage = 1, isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      const data = await fetchNotifications(nextPage);
      if (nextPage === 1) {
        setNotifications(data);
      } else {
        setNotifications((prev) => ({
          new: prev.new,
          today: prev.today,
          earlier: [...prev.earlier, ...(data.earlier || [])],
        }));
        if ((data.earlier || []).length < 20) setHasMore(false);
      }
    } catch (err) {
      console.error("Error loading notifications:", err);
    } finally {
      if (isRefresh) setRefreshing(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      loadNotifications(); // refresh
    } catch (err) {
      console.error("Mark all as read failed:", err);
    }
  };

  const renderNotification = (item) => {
    const user = item.user || {};
    const complaint = item.complaint || {};

    const messageMap = {
      like: "liked your post.",
      comment: "commented on your post.",
      repost: "reposted your post.",
      follow: "started following you.",
      new_post: "posted a new complaint.",
      own_post: "Your post is live!",
    };

    const message = messageMap[item.type] || "sent you a notification.";

    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.notificationCard, item.seen ? {} : styles.unread]}
        onPress={async () => {
          if (complaint?.id) {
            navigation.navigate("postdetails", { postId: complaint.id });

            try {
              await markNotificationAsRead(item.id);
              setNotifications((prev) => {
                const updateSeen = (arr) =>
                  arr.map((n) => (n.id === item.id ? { ...n, seen: true } : n));

                return {
                  new: updateSeen(prev.new),
                  today: updateSeen(prev.today),
                  earlier: updateSeen(prev.earlier),
                };
              });
            } catch (err) {
              console.error("Failed to mark as read:", err);
            }
          }
        }}
      >
        <Image
          source={{ uri: `${BASE_URL}${user?.profile_image_url || ""}` }}
          style={styles.avatar}
        />
        <View style={styles.content}>
          <Text style={[styles.message, { color: themeColors.notinames }]}>
            {user.first_name} {user.last_name}
            <Text style={[styles.gray, { color: themeColors.notinames }]}>
              {message}
            </Text>
          </Text>
          {complaint.text && (
            <Text style={[styles.snippet, { color: themeColors.notinames }]}>
              {complaint.text}
            </Text>
          )}
          <Text style={styles.time}>{timeAgo(item.created_at)}</Text>
        </View>
        {complaint?.file && (
          <Image
            source={{ uri: `${BASE_URL}${complaint.file}` }}
            style={styles.thumb}
          />
        )}
      </TouchableOpacity>
    );
  };

  const allNotifications = [
    ...(notifications.new || []),
    ...(notifications.today || []),
    ...(notifications.earlier || []),
  ];

  return (
    <View style={styles.container}>
      <LinearGradient colors={customGradient} style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={customIconBack} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: themeColors.text }]}>
            Notifications
          </Text>
          <TouchableOpacity onPress={handleMarkAllRead}>
            <Text style={[styles.markAll, { color: themeColors.line }]}>
              Mark all as read
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={allNotifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => renderNotification(item)}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadNotifications(1, true)}
            />
          }
          ListFooterComponent={
            hasMore ? (
              <TouchableOpacity
                onPress={() => {
                  setPage((p) => p + 1);
                  setLoadingMore(true);
                  loadNotifications(page + 1).finally(() =>
                    setLoadingMore(false)
                  );
                }}
                style={styles.loadMore}
              >
                {loadingMore ? (
                  <ActivityIndicator size="small" color="#333" />
                ) : (
                  <Text
                    style={[styles.loadMoreText, { color: themeColors.line }]}
                  >
                    show more
                  </Text>
                )}
              </TouchableOpacity>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.noNotif}>
              <Text style={[styles.noNotifText, { color: themeColors.text }]}>
                No notifications
              </Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </LinearGradient>
      <Navbar />
    </View>
  );
};

export default NotificationsScreen;

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
    paddingBottom: 10,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  markAll: {
    fontWeight: "600",
    fontSize: 14,
  },
  notificationCard: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  unread: {
    backgroundColor: "#35002C",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 2,
  },
  gray: {
    fontWeight: "400",
  },
  snippet: {
    fontSize: 12,
    color: "#888",
  },
  time: {
    fontSize: 11,
    color: "#687684",
    marginTop: 4,
  },
  thumb: {
    width: 45,
    height: 45,
    borderRadius: 6,
  },
  noNotif: {
    padding: 50,
    alignItems: "center",
  },
  noNotifText: {
    color: "#999",
    fontSize: 16,
  },
  loadMore: {
    alignItems: "center",
    marginVertical: 20,
  },
  loadMoreText: {
    fontWeight: "600",
  },
});
