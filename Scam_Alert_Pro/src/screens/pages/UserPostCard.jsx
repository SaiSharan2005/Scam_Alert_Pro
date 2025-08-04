import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Gallery from "../../../assets/gallery.svg";
import File from "../../../assets/file.svg";
import Emoji from "../../../assets/emoji.svg";
import * as ImagePicker from "expo-image-picker";
import EmojiPicker from "rn-emoji-keyboard";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import { LinearGradient } from "expo-linear-gradient";
import {
  getProfile,
  BASE_URL,
  postComplaint,
  updateComplaint,
  repost,
} from "../../utils/api";
import { useTheme } from "../../utils/ThemeContext";
import {
  useAudioRecorder,
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorderState,
  useAudioPlayer,
} from "expo-audio";

const UserPostCard = ({ navigation, route }) => {
  const [complaint, setComplaint] = useState("");
  const [open, setOpen] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [user, setUser] = useState(null);

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [loading, setLoading] = useState(false);

  const { isDark, themeColors } = useTheme();
  const customGradient = isDark
    ? ["#000000", "#8E1A7B"]
    : ["#FFFFFF", "#FFFFFF"];
  const customIconBack = isDark ? "#FFFFFF" : "#000000";
  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await getProfile();
        setUser(userData);

        const postToUse = route.params?.post || route.params?.originalPost;

        if (postToUse) {
          setComplaint(postToUse.text_content || postToUse.text || "");

          const preloadedFiles = postToUse.attachments || postToUse.files || [];
          const formattedFiles = preloadedFiles.map((file) => ({
            uri: `${BASE_URL}/${file.file_url.replace(/\\/g, "/")}`,
            name: file.file_url.split("/").pop(),
            type:
              file.file_type === "image"
                ? "image/jpeg"
                : file.file_type === "video"
                ? "video/mp4"
                : file.file_type === "audio"
                ? "audio/mpeg"
                : "application/octet-stream",
            isRemote: true,
          }));

          setAttachments(formattedFiles);
        }
      } catch (err) {
        console.error("Failed to load user or post", err);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert("Permission Denied", "Microphone access is required.");
      }

      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
    })();
  }, []);

  const AudioPreview = ({ uri, fileName }) => {
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={{ marginRight: 8 }}> {fileName}</Text>
      </View>
    );
  };

  const recordAudio = async () => {
    try {
      await audioRecorder.prepareToRecordAsync();
      await audioRecorder.record();
    } catch (err) {
      console.error("Recording start failed:", err);
      Alert.alert("Error", "Could not start recording.");
    }
  };

  const stopRecording = async () => {
    if (!recorderState.isRecording) {
      Alert.alert("Error", "Recording is not active.");
      return;
    }

    try {
      await audioRecorder.stop();

      const uri = audioRecorder.uri;

      if (!uri) {
        Alert.alert("Error", "No audio file URI found.");
        return;
      }

      const fileName = `audio_${Date.now()}.m4a`;
      const newPath = FileSystem.documentDirectory + fileName;

      await FileSystem.copyAsync({ from: uri, to: newPath });

      const audioFile = {
        uri: newPath,
        name: fileName,
        type: "audio/m4a",
      };

      setAttachments((prev) => [...prev, audioFile]);
      setRecordedAudio(audioFile);

      Alert.alert("Success", "Audio recorded and attached.");
    } catch (err) {
      console.error("stopRecording error:", err);
      Alert.alert("Error", "Failed to stop recording.");
    }
  };

  const handlePost = async () => {
    if (!complaint.trim()) {
      Alert.alert("Error", "Please enter a complaint");
      return;
    }

    setLoading(true); // Start spinner and disable button

    const isEdit = route.params?.post && !route.params?.isRepost;
    const isRepost = route.params?.isRepost;
    const isSelfRepost = isRepost && route.params?.post?.user?.id === user?.id;

    try {
      if (isEdit || isSelfRepost) {
        const complaintId = route.params.post.id.split("-")[0];
        await updateComplaint(complaintId, complaint, attachments);
        Alert.alert("Updated", "Complaint updated successfully");
      } else if (isRepost && route.params?.post?.id) {
        await repost(route.params.post.id);
        Alert.alert("Success", "Repost done");
      } else {
        await postComplaint(complaint, attachments);
        Alert.alert("Success", "Complaint posted");
      }

      setComplaint("");
      setAttachments([]);
      navigation.goBack();
    } catch (err) {
      console.error("Post failed", err);
      Alert.alert("Error", err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const pickFromCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission Denied", "Camera access is required.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      setAttachments((prev) => [
        ...prev,
        {
          uri: asset.uri,
          name: asset.fileName || `image_${Date.now()}.jpg`,
          type: asset.type === "video" ? "video/mp4" : "image/jpeg",
        },
      ]);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      setAttachments((prev) => [
        ...prev,
        {
          uri: asset.uri,
          name: asset.fileName || `image_${Date.now()}.jpg`,
          type: asset.type === "video" ? "video/mp4" : "image/jpeg",
        },
      ]);
    }
  };

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.ms-excel",
          "audio/*",
          "video/*",
        ],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (attachments.length >= 5) {
        Alert.alert("Limit Reached", "You can only attach up to 5 files.");
        return;
      }

      if (!result.canceled && result.assets?.length) {
        const asset = result.assets[0];
        const fileUri = asset.uri;
        const fileName = asset.name || `document-${Date.now()}.pdf`;
        const newPath = FileSystem.documentDirectory + fileName;

        await FileSystem.copyAsync({ from: fileUri, to: newPath });
        const fileInfo = await FileSystem.getInfoAsync(newPath);

        if (fileInfo.exists) {
          setAttachments((prev) => [
            ...prev,
            {
              uri: newPath,
              name: fileName,
              type: asset.mimeType || "application/octet-stream",
            },
          ]);
        } else {
          Alert.alert("Error", "Could not attach file.");
        }
      }
    } catch (err) {
      console.error("Document pick error:", err);
      Alert.alert("Error", "Could not pick document.");
    }
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <LinearGradient colors={customGradient} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={customIconBack} />
          </TouchableOpacity>
        </View>

        <View style={styles.complaintBox}>
          <View style={styles.card}>
            <Image
              source={{ uri: `${BASE_URL}${user?.profile_image_url}` }}
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Text style={styles.name}>
                {`${user?.first_name ?? ""} ${user?.last_name ?? ""}`}
              </Text>
              <Text style={styles.username}>@{user?.username ?? ""}</Text>
            </View>
          </View>

          <TextInput
            placeholder="What’s Happening?"
            placeholderTextColor="#999"
            style={styles.input}
            multiline
            value={complaint}
            onChangeText={setComplaint}
          />

          <View style={styles.line} />

          <View style={styles.inputActions}>
            <View style={styles.icons}>
              <TouchableOpacity onPress={pickImage}>
                <Gallery width={20} height={20} />
              </TouchableOpacity>

              <TouchableOpacity onPress={pickFromCamera}>
                <Ionicons name="camera" size={24} color="#6C7278" />
              </TouchableOpacity>

              <TouchableOpacity onPress={handlePickDocument}>
                <File width={30} height={30} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={
                  recorderState.isRecording ? stopRecording : recordAudio
                }
              >
                <Ionicons
                  name={recorderState.isRecording ? "stop-circle" : "mic"}
                  size={24}
                  color={recorderState.isRecording ? "red" : "#6C7278"}
                />
              </TouchableOpacity>

              <EmojiPicker
                open={open}
                onEmojiSelected={(e) => setComplaint((prev) => prev + e.emoji)}
                onClose={() => setOpen(false)}
              />
              <TouchableOpacity onPress={() => setOpen(true)}>
                <Emoji width={20} height={20} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.postButton, loading && { opacity: 0.6 }]}
              onPress={handlePost}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.postText}>Post</Text>
              )}
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.attachmentScroll}
          >
            {attachments.map((file, index) => {
              const fileType = file.type || "";
              const lowerType = fileType.toLowerCase();

              const isAudio =
                lowerType.startsWith("audio/") || lowerType.endsWith(".m4a");
              const isImage = lowerType.startsWith("image/");
              const isVideo = lowerType.startsWith("video/");

              return (
                <View key={index} style={styles.attachmentChip}>
                  {isAudio ? (
                    <AudioPreview uri={file.uri} fileName={file.name} />
                  ) : isImage ? (
                    <Image
                      source={{ uri: file.uri }}
                      style={{ width: 50, height: 50, borderRadius: 8 }}
                    />
                  ) : (
                    <Text style={styles.attachmentText}>
                      📎{" "}
                      {file.name.length > 20
                        ? file.name.slice(0, 17) + "..."
                        : file.name}
                    </Text>
                  )}
                  <TouchableOpacity onPress={() => removeAttachment(index)}>
                    <Text style={styles.removeIcon}>❌</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};
export default UserPostCard;

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
  card: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    width: 300,
    height: 52,
    top: 10,
    left: 8,
    gap: 10,
  },
  avatar: { width: 37.12, height: 37.12, borderRadius: 20 },
  userInfo: {
    flexDirection: "column",
    bottom: 15,
    width: 282.08,
    height: 18,
    gap: 5,
  },
  name: { fontWeight: "700", fontSize: 14.85 },
  username: { color: "gray", fontSize: 14.85 },
  complaintBox: {
    backgroundColor: "#FFFFFF",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 14,
    width: 375,
    height: 338,
    top: 10,
    left: 9,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    height: 100,
    textAlignVertical: "top",
    fontSize: 20,
    top: 10,
    left: 10,
    color: "#000",
  },
  line: {
    borderColor: "#cccccc31",
    width: 350,
    borderWidth: 1,
    left: 20,
    top: 110,
  },
  inputActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    top: 130,
    gap: 75,
  },
  icons: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  postButton: {
    backgroundColor: "#8E1A7B",
    borderRadius: 20,
    paddingHorizontal: 22,
    paddingVertical: 6,
  },
  postText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },

  attachmentScroll: {
    marginHorizontal: 10,
    marginTop: 20,
    maxHeight: 30,
  },

  attachmentChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
  },

  attachmentText: {
    color: "#333",
    fontSize: 12,
    marginRight: 4,
  },

  removeIcon: {
    fontSize: 12,
    color: "red",
  },
});
