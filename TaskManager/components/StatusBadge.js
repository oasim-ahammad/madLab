import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StatusBadge = ({ status }) => {
  if (!status) return null;

  const getStatusColor = () => {
    const s = status.toLowerCase();
    if (s.includes('pending') || s.includes('todo') || s.includes('to do')) return '#808080';
    if (s.includes('progress') || s.includes('doing')) return '#007BFF';
    if (s.includes('review')) return '#FFC107';
    if (s.includes('completed') || s.includes('done')) return '#28A745';
    return '#6C757D'; // Default
  };

  return (
    <View style={[styles.badge, { backgroundColor: getStatusColor() }]}>
      <Text style={styles.text}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  text: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default StatusBadge;
