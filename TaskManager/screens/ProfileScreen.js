import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { getBoards, getAllTasks } from '../storage/storageService';

const ProfileScreen = () => {
  const [stats, setStats] = useState({ totalBoards: 0, totalTasks: 0, completed: 0, pending: 0, percentage: 0 });
  const owner = "Current Device User";
  
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchStats();
    }
  }, [isFocused]);

  const fetchStats = async () => {
    try {
      const boards = await getBoards();
      const tasks = await getAllTasks();
      
      let totalTasks = 0;
      let completed = 0;
      let pending = 0;
      
      tasks.forEach(task => {
        if (task.owner === owner || (task.members && task.members.includes(owner))) {
          totalTasks++;
          if (task.status === 'Completed') {
            completed++;
          } else {
            pending++;
          }
        }
      });
      
      const percentage = totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;
      
      setStats({ 
        totalBoards: boards.length, 
        totalTasks, 
        completed, 
        pending, 
        percentage 
      });
    } catch (e) {
      console.error('Error fetching profile stats', e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarText}>{owner.charAt(0)}</Text>
        </View>
        <Text style={styles.name}>{owner}</Text>
        
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>{stats.percentage}% Completed</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${stats.percentage}%` }]} />
          </View>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
             <Text style={styles.statValue}>{stats.totalBoards}</Text>
             <Text style={styles.statLabel}>Total Boards</Text>
          </View>
          <View style={styles.statBox}>
             <Text style={styles.statValue}>{stats.totalTasks}</Text>
             <Text style={styles.statLabel}>Total Tasks</Text>
          </View>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
             <Text style={[styles.statValue, { color: '#007BFF' }]}>{stats.pending}</Text>
             <Text style={styles.statLabel}>Pending Tasks</Text>
          </View>
          <View style={styles.statBox}>
             <Text style={[styles.statValue, { color: '#28A745' }]}>{stats.completed}</Text>
             <Text style={styles.statLabel}>Completed Tasks</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    alignItems: 'center',
    padding: 24,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
    color: '#FFF',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 22,
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 32,
    alignItems: 'center',
  },
  progressText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  progressBarBg: {
    width: '80%',
    height: 12,
    backgroundColor: '#333',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#28A745',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  statBox: {
    backgroundColor: '#1E1E1E',
    padding: 20,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  statValue: {
    fontSize: 32,
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statLabel: {
    color: '#AAA',
    fontSize: 14,
  },
});

export default ProfileScreen;
