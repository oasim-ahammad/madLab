import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getTaskColor } from '../utils/colorLogic';
import { getRemainingTime } from '../utils/timeUtils';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';
import MemberAvatar from './MemberAvatar';

const TaskCard = ({ task, onPress }) => {
  const taskColor = getTaskColor(task.startDate, task.requiredTime, task.status);

  return (
    <View style={[styles.card, { borderLeftColor: taskColor }]}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>{task.name}</Text>
        <PriorityBadge priority={task.priority} />
      </View>
      
      {task.description ? (
        <Text style={styles.description} numberOfLines={2}>{task.description}</Text>
      ) : null}

      <View style={styles.details}>
        <Text style={styles.detailText}>Due: {new Date(task.deadline).toLocaleDateString()}</Text>
        <Text style={styles.detailText}>{getRemainingTime(task.deadline)}</Text>
      </View>

      <View style={styles.footer}>
        <StatusBadge status={task.status} />
        <MemberAvatar members={task.members} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E1E1E', // Dark theme card
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  description: {
    color: '#CCC',
    fontSize: 12,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailText: {
    color: '#AAA',
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default TaskCard;
