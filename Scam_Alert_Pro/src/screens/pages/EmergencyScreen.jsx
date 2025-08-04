import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Navbar from "./Navbar";
import { LinearGradient } from "expo-linear-gradient";
import Gallery from "../../../assets/gallery.svg";
import File from "../../../assets/file.svg";
import Emoji from "../../../assets/emoji.svg";
import * as ImagePicker from "expo-image-picker";
import EmojiPicker from "rn-emoji-keyboard";
import * as DocumentPicker from "expo-document-picker";
import { useTheme } from "../../utils/ThemeContext";
import { postEmergency } from "../../utils/api";
import * as FileSystem from "expo-file-system";
import {
  useAudioRecorder,
  RecordingPresets,
  useAudioRecorderState,
} from "expo-audio";

const EmergencyScreen = ({ navigation }) => {
  const { isDark, themeColors } = useTheme();
  const customGradient = isDark
    ? ["#000000", "#8E1A7B"]
    : ["#FFFFFF", "#FFFFFF"];
  const customGradientButton = isDark
    ? ["#FFFFFF", "#FFFFFF"]
    : ["#83838366", "#FFFFFF"];
  const customIconBack = isDark ? "#FFFFFF" : "#000000";
  const [complaint, setComplaint] = useState("");
  const [open, setOpen] = useState(false);
  const [attachments, setAttachments] = useState([]);

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    if (!complaint.trim()) {
      Alert.alert("Error", "Please enter a complaint");
      return;
    }

    setLoading(true);

    try {
      await postEmergency(complaint, attachments);
      Alert.alert("Success", "Complaint posted");
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
    <View style={{ flex: 1 }}>
      <LinearGradient colors={customGradient} style={styles.gradient}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={customIconBack} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: themeColors.text }]}>
              Emergency
            </Text>
          </View>

          {/* Description */}
          <View style={styles.description}>
            <Text style={[styles.subtitle, { color: themeColors.text }]}>
              Report emergencies instantly. Fast, secure, & trackable
            </Text>
            <Text style={[styles.subheading, { color: themeColors.text }]}>
              YOUR SAFETY MATTERS
            </Text>
          </View>
          <Text style={[styles.detail, { color: themeColors.text }]}>
            Submit your complaint now, & we’ll take action immediately!
          </Text>

          {/* Complaint Box */}
          <View style={styles.complaintBox}>
            <TextInput
              placeholder="What’s Happening?"
              placeholderTextColor="#999"
              style={styles.input}
              multiline
              value={complaint}
              onChangeText={setComplaint}
            />

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
                  onEmojiSelected={(e) =>
                    setComplaint((prev) => prev + e.emoji)
                  }
                  onClose={() => setOpen(false)}
                />
                <TouchableOpacity onPress={() => setOpen(true)}>
                  <Emoji width={20} height={20} />
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  style={[styles.postButton, loading && { opacity: 0.6 }]}
                  onPress={handlePost}
                  disabled={loading}
                >
                  {loading ? (
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text style={styles.postText}>Posting</Text>
                      <View style={{ marginLeft: 10 }}>
                        <ActivityIndicator size="small" color="#000" />
                      </View>
                    </View>
                  ) : (
                    <Text style={styles.postText}>Post</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.attachmentScroll}
            >
              {attachments.map((file, index) => (
                <View key={index} style={styles.attachmentChip}>
                  {file.type.startsWith("audio/") ? (
                    <AudioPreview uri={file.uri} fileName={file.name} />
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
              ))}
            </ScrollView>
          </View>
          <View style={[styles.tline, { borderColor: themeColors.line }]} />

          {/* Call and Message Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.callButton}>
              <LinearGradient
                colors={["#905101", "#EB9E3C"]}
                style={styles.gradientButton}
              >
                <Text style={styles.buttonText}>CALL</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <View style={[styles.bline, { borderColor: themeColors.line }]} />

          {/* Raise a Complaint */}
          <TouchableOpacity style={styles.raiseButton}>
            <LinearGradient
              colors={customGradientButton}
              style={styles.gradientButton}
            >
              <Text style={styles.raiseText}>+ RAISE A COMPLAINT</Text>
            </LinearGradient>
          </TouchableOpacity>
          <Text style={[styles.raiseSubtext, { color: themeColors.text }]}>
            Proceed to fill the complaint details
          </Text>
        </View>
        <Navbar />
      </LinearGradient>
    </View>
  );
};

export default EmergencyScreen;

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
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 12,
  },
  description: {
    width: 311,
    height: 100,
    left: 25,
    gap: 5,
  },
  subtitle: {
    fontSize: 13,
  },
  subheading: {
    fontWeight: "bold",
    fontSize: 14,
  },
  detail: {
    fontSize: 11,
    color: "#333",
    width: 311,
    bottom: 35,
    left: 25,
  },
  complaintBox: {
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 14,
    width: 360,
    height: 250,
    left: 15,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    height: 100,
    textAlignVertical: "top",
    fontSize: 14,
    top: 15,
    left: 10,
    color: "#000",
  },
  inputActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    top: 100,
    gap: 55,
  },
  icons: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  postButton: {
    backgroundColor: "#8E1A7B",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  postText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 35,
    top: 25,
  },
  tline: {
    width: 350,
    borderWidth: 1,
    left: 20,
    top: 25,
  },
  bline: {
    width: 350,
    borderWidth: 1,
    left: 20,
    top: 5,
  },
  gradientButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },

  callButton: {
    width: 150,
    bottom: 10,
    height: 45,
    borderRadius: 10,
    overflow: "hidden",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  raiseButton: {
    width: 220,
    height: 40,
    top: 40,
    borderRadius: 10,
    overflow: "hidden",
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#375DFB",
    shadowColor: "#253EA77A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  raiseText: {
    fontWeight: "700",
    color: "#133576",
  },
  raiseSubtext: {
    fontSize: 8,
    top: 50,
    left: 130,
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
