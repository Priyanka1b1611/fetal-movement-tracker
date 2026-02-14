import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  Image,
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

export default function Home() {
  const [sessions, setSessions] = useState<Session[]>([]);

  const loadSessions = async () => {
    const stored = await AsyncStorage.getItem("sessions");
    if (stored) {
      setSessions(JSON.parse(stored));
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSessions();
    }, []),
  );

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toDateString();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>DFM (Kick counter)</Text>
        <View style={styles.counterBox}>
          <Text style={styles.baby}>👶</Text>
          <Text style={styles.count}>{sessions.length}</Text>
        </View>
      </View>

      {/* Article Card */}
      <View style={styles.articleCard}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1584515933487-779824d29309",
          }}
          style={styles.image}
        />
        <Text style={styles.articleText}>DFM (fetal movement)</Text>
      </View>

      {/* Record Button */}
      <TouchableOpacity
        style={styles.recordBtn}
        onPress={() => router.push("/Record DFM")}
      >
        <Text style={styles.recordText}>Record fetal movement</Text>
      </TouchableOpacity>

      {/* Past Records */}
      <Text style={styles.pastTitle}>Past records</Text>

      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.recordCard}>
            <Text style={styles.recordDate}>{formatDate(item.date)}</Text>
            <Text style={styles.recordMin}>
              {Math.max(1, item.minutes)}{" "}
              {Math.max(1, item.minutes) === 1 ? "min" : "mins"}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ marginTop: 10 }}>No records yet</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F5F8",
    paddingTop: 20,
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 30,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
  },

  counterBox: {
    flexDirection: "row",
    alignItems: "center",
  },

  baby: {
    fontSize: 18,
    marginRight: 6,
  },

  count: {
    fontSize: 16,
    fontWeight: "600",
  },

  articleCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 25,
    elevation: 3,
  },

  image: {
    width: "100%",
    height: 150,
  },

  articleText: {
    position: "absolute",
    bottom: 15,
    left: 15,
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  recordBtn: {
    borderWidth: 1,
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 25,
  },

  recordText: {
    fontWeight: "600",
  },

  pastTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },

  recordCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  recordDate: {
    fontSize: 14,
  },

  recordMin: {
    fontSize: 14,
    fontWeight: "600",
  },
});
