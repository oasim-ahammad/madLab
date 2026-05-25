import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const [stats, setStats] = useState({ assigned: 0, completed: 0 });
  const owner = "Current Device User";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@tasks');
        const tasks = jsonValue != null ? JSON.parse(jsonValue) : [];
        
        let assigned = 0;
        let completed = 0;
        
        tasks.forEach(task => {
          if (task.owner === owner || (task.members && task.members.includes(owner))) {
            assigned++;
            if (task.status === 'Completed') {
              completed++;
            }
          }
        });
        
        setStats({ assigned, completed });
      } catch (e) {
        console.error('Error fetching stats', e);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarText}>{owner.charAt(0)}</Text>
        </View>
        <Text style={styles.name}>{owner}</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{stats.assigned}</Text>
            <Text style={styles.statLabel}>Assigned Tasks</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{stats.completed}</Text>
            <Text style={styles.statLabel}>Completed Tasks</Text>
          </View>
        </View>
      </View>
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
    marginBottom: 32,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
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
