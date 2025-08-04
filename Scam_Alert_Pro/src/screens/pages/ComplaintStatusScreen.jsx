import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Modal,
  Linking,
} from "react-native";
import { fetchEmergenciesByStatus, BASE_URL } from "../../utils/api";
import AudioPlayer from "../../utils/AudioPlayer";
import { useVideoPlayer, VideoView } from "expo-video";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../utils/ThemeContext";

const ComplaintStatusScreen = () => {
  const [status, setStatus] = useState("pending");
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const { isDark, themeColors } = useTheme();
  const customGradientpost = isDark
    ? ["#000000", "#8E1A7B"]
    : ["#8E1A7B", "#FFFFFF"];

  const fetchEmergencies = async (selectedStatus) => {
    try {
      setLoading(true);
      const res = await fetchEmergenciesByStatus(selectedStatus);
      setEmergencies(res.data || []);
    } catch (err) {
      console.error("Error fetching emergencies:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmergencies(status);
  }, [status]);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchEmergencies(status);
    } catch (err) {
      console.error("Refresh error:", err);
    } finally {
      setRefreshing(false);
    }
  };

  const VideoComponent = ({ uri }) => {
    const player = useVideoPlayer(uri, (p) => {
      p.loop = false;
    });

    return (
      <VideoView
        style={styles.media}
        player={player}
        useNativeControls
        allowsFullscreen
        resizeMode="contain"
      />
    );
  };

  const renderFile = (file, index) => {
    const uri = `${BASE_URL}/${file.file_url
      .replace(/\\/g, "/")
      .replace(/^\/?/, "")}`;

    if (file.file_type === "image") {
      return (
        <TouchableOpacity
          key={`img-${index}`}
          onPress={() => setSelectedImage(uri)}
        >
          <Image source={{ uri }} style={styles.media} resizeMode="cover" />
        </TouchableOpacity>
      );
    }

    if (file.file_type === "video") {
      return <VideoComponent key={`vid-${index}`} uri={uri} />;
    }

    if (file.file_type === "audio") {
      return (
        <View key={`aud-${index}`} style={styles.audioBox}>
          <AudioPlayer uri={uri} />
        </View>
      );
    }

    return (
      <TouchableOpacity
        key={`doc-${index}`}
        onPress={() => Linking.openURL(uri)}
        style={styles.docButton}
      >
        <Text style={[styles.docText, { color: themeColors.text }]}>
          📄 View Document
        </Text>
      </TouchableOpacity>
    );
  };

  const renderEmergency = ({ item }) => (
    <LinearGradient colors={customGradientpost} style={styles.gradient}>
      <View style={[styles.card, { backgroundColor: themeColors.card }]}>
        <Text style={[styles.text, { color: themeColors.text }]}>
          {item.text}
        </Text>
        <Text style={[styles.meta, { color: themeColors.text }]}>
          Status: {item.status}
        </Text>
        <Text style={[styles.meta, { color: themeColors.text }]}>
          Created: {new Date(item.created_at).toLocaleString()}
        </Text>

        {item.files?.length > 0 && (
          <View style={{ marginTop: 10 }}>
            {item.files.map((file, idx) => renderFile(file, idx))}
          </View>
        )}
      </View>
    </LinearGradient>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      {/* Status Tabs */}
      <View style={styles.tabContainer}>
        {["pending", "resolved"].map((s) => (
          <TouchableOpacity
            key={s}
            style={[
              styles.tab,
              status === s && { borderBottomColor: themeColors.borderbottom },
            ]}
            onPress={() => setStatus(s)}
          >
            <Text style={{ color: themeColors.text, fontWeight: "500" }}>
              {s.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Emergency List */}
      {loading ? (
        <ActivityIndicator size="large" color={themeColors.text} />
      ) : (
        <FlatList
          data={emergencies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderEmergency}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: themeColors.text }]}>
              No emergencies found.
            </Text>
          }
          refreshing={refreshing}
          onRefresh={handleRefresh}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      {/* Fullscreen Image Modal */}
      <Modal
        visible={!!selectedImage}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
      >
        <TouchableOpacity
          style={styles.fullscreenContainer}
          onPress={() => setSelectedImage(null)}
        >
          <Image
            source={{ uri: selectedImage }}
            style={styles.fullscreenImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default ComplaintStatusScreen;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    borderBottomWidth: 1,
  },
  tab: {
    padding: 10,
    marginHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 10,
    padding: 12,
    borderRadius: 12,
    elevation: 2,
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
  },
  meta: {
    fontSize: 12,
    marginTop: 4,
  },
  media: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginTop: 8,
  },
  audioBox: {
    marginTop: 10,
  },
  docButton: {
    padding: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
    marginTop: 10,
  },
  docText: {
    fontWeight: "500",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: "#000000DD",
    justifyContent: "center",
    alignItems: "center",
  },
  fullscreenImage: {
    width: "100%",
    height: "100%",
  },
});
