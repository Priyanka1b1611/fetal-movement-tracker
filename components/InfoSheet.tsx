// components/InfoSheet.tsx
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface InfoSheetProps {
  visible: boolean;
  onClose: () => void;
}

export default function InfoSheet({ visible, onClose }: InfoSheetProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>How to Track Fetal Movements</Text>
          <Text>• Sit or lie down comfortably</Text>
          <Text>• Count each kick until you reach 10</Text>
          <Text>• Note the time taken</Text>
          <TouchableOpacity onPress={onClose} style={styles.button}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: { backgroundColor: '#fff', padding: 20, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  button: { marginTop: 20, backgroundColor: '#007AFF', padding: 10, borderRadius: 6 },
  buttonText: { color: '#fff', textAlign: 'center' },
});
