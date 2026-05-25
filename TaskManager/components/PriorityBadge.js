import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getPriorityColor } from '../utils/colorLogic';

const PriorityBadge = ({ priority }) => {
  if (!priority) return null;

  return (
    <View style={[styles.badge, { borderColor: getPriorityColor(priority) }]}>
      <Text style={[styles.text, { color: getPriorityColor(priority) }]}>{priority}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default PriorityBadge;
