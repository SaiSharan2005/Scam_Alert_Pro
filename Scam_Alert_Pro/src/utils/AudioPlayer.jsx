import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useAudioPlayer } from "expo-audio";
import { useTheme } from "./ThemeContext";

const AudioPlayer = ({ uri }) => {
  const { isDark, themeColors } = useTheme();

  const player = useAudioPlayer({ uri });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const playpause = isDark ? "#FFFFFF" : "#8E1A7B";
  const track = isDark ? "#8E1A7B" : "#FFFFFF";

  useEffect(() => {
    const interval = setInterval(() => {
      if (player?.playing && !isSeeking) {
        setCurrentTime(player.currentTime);
        setDuration(player.duration);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [player, isSeeking]);

  const togglePlayback = async () => {
    if (isPlaying) {
      await player.pause();
      setIsPlaying(false);
    } else {
      await player.play();
      setIsPlaying(true);
    }
  };

  const onSlidingStart = () => setIsSeeking(true);

  const onSlidingComplete = async (value) => {
    await player.seekTo(value);
    setCurrentTime(value);
    setIsSeeking(false);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <View
      style={[styles.container, { backgroundColor: themeColors.profileborder }]}
    >
      <View style={styles.controlsRow}>
        {/* Play / Pause Button */}
        <TouchableOpacity onPress={togglePlayback} style={[styles.playButton, {backgroundColor:themeColors.playbutton}]}>
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={15}
            color={playpause}
          />
        </TouchableOpacity>
        <View style={styles.progressRow}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration || 1}
            value={currentTime}
            minimumTrackTintColor={track}
            maximumTrackTintColor="#ccc"
            thumbTintColor={track}
            onSlidingStart={onSlidingStart}
            onSlidingComplete={onSlidingComplete}
          />
          <Text style={[styles.timeText, {color:themeColors.playbutton}]}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  playButton: {
    width: 30,
    height: 30,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    marginTop: 4,
  },
  slider: {
    flex: 1,
    height: 30,
  },
  timeText: {
    fontWeight: "bold",
    marginLeft: 8,
    minWidth: 70,
    textAlign: "right",
  },
});

export default AudioPlayer;
