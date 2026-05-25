import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationScreen = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchDeadlines = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@tasks');
        const tasks = jsonValue != null ? JSON.parse(jsonValue) : [];
        const now = new Date().getTime();
        
        let fetchedAlerts = [];
        
        tasks.forEach(task => {
          if (task.status === 'Completed' || !task.deadline) return;
          const deadlineTime = new Date(task.deadline).getTime();
          const diffMs = deadlineTime - now;
          const diffHours = diffMs / (1000 * 60 * 60);

          if (diffHours < 0) {
            fetchedAlerts.push({ id: task.id + '-overdue', type: 'Overdue', message: `${task.name} is overdue!` });
          } else if (diffHours <= 1) {
            fetchedAlerts.push({ id: task.id + '-1hr', type: 'Urgent', message: `${task.name} is due in less than 1 hour!` });
          } else if (diffHours <= 24) {
             fetchedAlerts.push({ id: task.id + '-1day', type: 'Upcoming', message: `${task.name} is due in less than 1 day.` });
          }
        });
        
        setAlerts(fetchedAlerts);
      } catch (e) {
        console.error('Error fetching alerts', e);
      }
    };
    
    fetchDeadlines();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>
      
      <FlatList
        data={alerts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.alertCard}>
            <Text style={[
              styles.alertType, 
              { color: item.type === 'Overdue' ? '#DC3545' : item.type === 'Urgent' ? '#FFC107' : '#007BFF' }
            ]}>
              {item.type}
            </Text>
            <Text style={styles.alertMessage}>{item.message}</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>No upcoming deadlines.</Text>}
      />
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
  listContent: {
    padding: 16,
  },
  alertCard: {
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#444',
  },
  alertType: {
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: 12,
  },
  alertMessage: {
    color: '#FFF',
    fontSize: 16,
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  }
});

export default NotificationScreen;
