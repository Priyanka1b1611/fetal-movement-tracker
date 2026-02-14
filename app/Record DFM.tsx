import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Session = {
  id: string;
  date: string;
  minutes: number;
  kicks: number;
};

export default function RecordDFM() {
  const [seconds, setSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [kicks, setKicks] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // ✅ Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout | number | undefined;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  // ✅ Stop automatically at 10 kicks
  useEffect(() => {
    if (kicks === 10) {
      setIsRunning(false);
    }
  }, [kicks]);

  const formatTime = () => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleKick = () => {
    if (!isRunning) return;
    if (kicks < 10) {
      setKicks((prev) => prev + 1);
    }
  };

  const handleSave = async () => {
    if (kicks < 10) return;

    const newSession: Session = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      // ✅ Always at least 1 minute
      minutes: Math.max(1, Math.ceil(seconds / 60)),
      kicks: kicks,
    };

    try {
      const stored = await AsyncStorage.getItem("sessions");
      const parsed: Session[] = stored ? JSON.parse(stored) : [];

      // ✅ Newest first
      parsed.unshift(newSession);

      await AsyncStorage.setItem("sessions", JSON.stringify(parsed));

      // Reset state
      setSeconds(0);
      setKicks(0);
      setIsRunning(false);

      router.back();
    } catch (error) {
      console.log("Save error:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Record DFM</Text>

        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.info}>ⓘ</Text>
        </TouchableOpacity>
      </View>

      {/* Info Bubble */}
      <View style={styles.bubble}>
        <Text style={styles.bubbleText}>Stop recording after 10 kicks</Text>
      </View>

      {/* Timer */}
      <TouchableOpacity
        style={styles.timerContainer}
        onPress={handleKick}
        activeOpacity={0.9}
      >
        <Text style={styles.timer}>{formatTime()}</Text>
      </TouchableOpacity>

      {/* Play / Pause */}
      <TouchableOpacity
        style={styles.playButton}
        onPress={() => setIsRunning(!isRunning)}
      >
        <Text style={{ fontSize: 24 }}>{isRunning ? "⏸" : "▶"}</Text>
      </TouchableOpacity>

      {/* Save Button */}
      <TouchableOpacity
        style={[styles.saveButton, { opacity: kicks === 10 ? 1 : 0.5 }]}
        onPress={handleSave}
        disabled={kicks < 10}
      >
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>

      {/* Help */}
      <Pressable onPress={() => setModalVisible(true)}>
        <Text style={styles.helpText}>
          What if I am not getting enough kicks?
        </Text>
      </Pressable>

      {/* Modal */}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.sheet}>
            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>

            {/* Title */}
            <View style={styles.header}>
              <Text style={styles.sheetTitle}>Steps to count fetal kicks</Text>
            </View>

            {/* Step 1 */}
            <View style={styles.lightRow}>
              <Text style={styles.sheetText}>
                1. Choose a <Text style={styles.bold}>time</Text> when you are{" "}
                <Text style={styles.bold}>least distracted</Text> or when you
                typically <Text style={styles.bold}>feel the fetus move.</Text>
              </Text>
            </View>

            {/* Step 2 */}
            <View style={styles.darkRow}>
              <Text style={styles.sheetText}>
                2. Get <Text style={styles.bold}>comfortable.</Text> Lie on your{" "}
                <Text style={styles.bold}>left side</Text> or sit with your feet
                propped up.
              </Text>
            </View>

            {/* Step 3 */}
            <View style={styles.lightRow}>
              <Text style={styles.sheetText}>
                3. Place your{" "}
                <Text style={styles.bold}>hands on your belly.</Text>
              </Text>
            </View>

            {/* Step 4 */}
            <View style={styles.darkRow}>
              <Text style={styles.sheetText}>
                4. <Text style={styles.bold}>Start a timer</Text> or watch the
                clock.
              </Text>
            </View>

            {/* Step 5 */}
            <View style={styles.lightRow}>
              <Text style={styles.sheetText}>
                5. <Text style={styles.bold}>Count</Text> each kick. Keep
                counting until you get to{" "}
                <Text style={styles.bold}>
                  10 kicks / flutters / swishes / rolls.
                </Text>
              </Text>
            </View>

            {/* Step 6 */}
            <View style={styles.darkRow}>
              <Text style={styles.sheetText}>
                6. Once you reach <Text style={styles.bold}>10 kicks</Text>, jot
                down how many <Text style={styles.bold}>minutes</Text> it took.
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F3F8",
    padding: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
  },

  back: {
    fontSize: 28,
    fontWeight: 600,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
  },

  info: {
    fontSize: 25,
  },

  bubble: {
    marginTop: 60,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    alignSelf: "center",
  },

  bubbleText: {
    fontWeight: "500",
  },

  timerContainer: {
    marginTop: 100,
    alignSelf: "center",
    backgroundColor: "#fff",
    width: 220,
    height: 100,
    borderRadius: 70,
    alignItems: "center",
    justifyContent: "center",
  },

  timer: {
    fontSize: 36,
    fontWeight: "700",
    color: "#E74C3C",
  },

  playButton: {
    marginTop: 40,
    alignSelf: "center",
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  saveButton: {
    marginTop: 50,
    borderWidth: 1,
    borderColor: "#000",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },

  saveText: {
    fontWeight: "600",
  },

  helpText: {
    marginTop: 20,
    textAlign: "center",
    textDecorationLine: "underline",
    fontWeight: "500",
  },

  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },

  sheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  sheetTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },

  sheetText: {
    marginBottom: 6,
  },

  lightRow: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 18,
    paddingHorizontal: 20,
  },

  darkRow: {
    backgroundColor: "#EFEFEF",
    paddingVertical: 18,
    paddingHorizontal: 20,
  },

  bold: {
    fontWeight: "700",
  },

  closeIcon: {
    position: "absolute",
    right: 16,
    top: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EAEAEA",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },

  closeText: {
    fontSize: 20,
    fontWeight: "600",
  },

  closeBtn: {
    marginTop: 15,
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
  },
});
