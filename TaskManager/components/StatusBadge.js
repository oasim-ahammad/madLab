import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StatusBadge = ({ status }) => {
  if (!status) return null;

  const getStatusColor = () => {
    switch (status) {
      case 'Pending':
        return '#808080';
      case 'In Progress':
        return '#007BFF';
      case 'Review':
        return '#FFC107';
      case 'Completed':
        return '#28A745';
      default:
        return '#6C757D';
    }
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
