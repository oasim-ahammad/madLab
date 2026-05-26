import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getTaskColor, getPriorityColor } from '../utils/colorLogic';
import { getRemainingTime } from '../utils/timeUtils';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';
import MemberAvatar from './MemberAvatar';

const TaskCard = ({ task, onPress, onMoveLeft, onMoveRight }) => {
  const taskColor = getTaskColor(task.startDate, task.requiredTime, task.status);
  const priorityColor = getPriorityColor(task.priority);

  const safeDateStr = (dateStr) => {
    if (!dateStr) return 'No Date';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? 'Invalid Date' : d.toLocaleDateString();
  };

  return (
    <View style={[styles.card, { borderLeftColor: taskColor, borderColor: priorityColor }]}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>{task.name}</Text>
        <PriorityBadge priority={task.priority} />
      </View>
      
      {task.description ? (
        <Text style={styles.description} numberOfLines={2}>{task.description}</Text>
      ) : null}

      <View style={styles.details}>
        <Text style={styles.detailText}>Due: {safeDateStr(task.deadline)}</Text>
        <Text style={styles.detailText}>{getRemainingTime(task.deadline)}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.statusAndMoves}>
          {onMoveLeft && (
            <TouchableOpacity onPress={onMoveLeft} style={styles.moveBtn}>
               <Text style={styles.moveBtnText}>{'<'}</Text>
            </TouchableOpacity>
          )}
          <StatusBadge status={task.status} />
          {onMoveRight && (
            <TouchableOpacity onPress={onMoveRight} style={styles.moveBtn}>
               <Text style={styles.moveBtnText}>{'>'}</Text>
            </TouchableOpacity>
          )}
        </View>
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
    borderLeftWidth: 6, // Make progress indicator thicker
    borderWidth: 1, // Base border for priority
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
    marginTop: 8,
  },
  statusAndMoves: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moveBtn: {
    backgroundColor: '#333',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  moveBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default TaskCard;
