import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { AppContext } from '../context/AppContext';
import BoardCard from '../components/BoardCard';
import { initializeDefaultLists, getAllTasks, getAllActivityLogs } from '../storage/storageService';

const HomeScreen = ({ navigation }) => {
  const { boards, addBoard, removeBoard } = useContext(AppContext);
  const [newBoardName, setNewBoardName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, overdue: 0, upcoming: 0 });
  const [recentLogs, setRecentLogs] = useState([]);
  
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadDashboardData();
    }
  }, [isFocused]);

  const loadDashboardData = async () => {
    const tasks = await getAllTasks();
    const logs = await getAllActivityLogs();
    
    let total = tasks.length;
    let completed = 0;
    let pending = 0;
    let overdue = 0;
    let upcoming = 0;
    
    const now = new Date().getTime();
    
    tasks.forEach(task => {
      if (task.status === 'Completed') {
        completed++;
      } else {
        pending++;
        if (task.deadline) {
           const deadlineTime = new Date(task.deadline).getTime();
           if (!isNaN(deadlineTime)) {
             if (deadlineTime < now) {
               overdue++;
             } else if (deadlineTime - now <= 24 * 60 * 60 * 1000) {
               upcoming++;
             }
           }
        }
      }
    });
    
    setStats({ total, completed, pending, overdue, upcoming });
    
    // Sort logs by newest first, take top 5
    const sortedLogs = logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5);
    setRecentLogs(sortedLogs);
  };

  const handleCreateBoard = async () => {
    if (newBoardName.trim().length === 0) return;
    const board = await addBoard({ name: newBoardName });
    await initializeDefaultLists(board.id);
    setNewBoardName('');
  };

  const filteredBoards = boards.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const renderDashboardHeader = () => (
    <View style={styles.dashboardSection}>
      <Text style={styles.sectionTitle}>Dashboard Statistics</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}><Text style={styles.statNum}>{stats.total}</Text><Text style={styles.statLabel}>Total Tasks</Text></View>
        <View style={[styles.statCard, { borderBottomColor: '#28A745', borderBottomWidth: 3 }]}><Text style={styles.statNum}>{stats.completed}</Text><Text style={styles.statLabel}>Completed</Text></View>
        <View style={[styles.statCard, { borderBottomColor: '#007BFF', borderBottomWidth: 3 }]}><Text style={styles.statNum}>{stats.pending}</Text><Text style={styles.statLabel}>Pending</Text></View>
        <View style={[styles.statCard, { borderBottomColor: '#DC3545', borderBottomWidth: 3 }]}><Text style={styles.statNum}>{stats.overdue}</Text><Text style={styles.statLabel}>Overdue</Text></View>
        <View style={[styles.statCard, { borderBottomColor: '#FFC107', borderBottomWidth: 3 }]}><Text style={styles.statNum}>{stats.upcoming}</Text><Text style={styles.statLabel}>Upcoming</Text></View>
      </View>
      
      <Text style={styles.sectionTitle}>Recent Activity</Text>
      <View style={styles.activityContainer}>
        {recentLogs.length > 0 ? (
           recentLogs.map(log => (
             <View key={log.id} style={styles.logItem}>
               <Text style={styles.logText}>{log.message}</Text>
             </View>
           ))
        ) : (
           <Text style={styles.emptyText}>No recent activity found.</Text>
        )}
      </View>

      <Text style={styles.sectionTitle}>My Boards</Text>
      <View style={styles.createContainer}>
        <TextInput
          style={styles.input}
          placeholder="New board name..."
          placeholderTextColor="#888"
          value={newBoardName}
          onChangeText={setNewBoardName}
        />
        <TouchableOpacity style={styles.createButton} onPress={handleCreateBoard}>
          <Text style={styles.createButtonText}>Create</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Task Manager</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search boards..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredBoards}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderDashboardHeader}
        renderItem={({ item }) => (
          <BoardCard 
            board={item} 
            onPress={() => navigation.navigate('Board', { boardId: item.id, boardName: item.name })}
            onDelete={() => removeBoard(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={[styles.emptyText, {marginTop: 20}]}>No boards available. Create one above!</Text>}
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
  inputContainer: {
    padding: 16,
    paddingBottom: 0,
  },
  input: {
    backgroundColor: '#1E1E1E',
    color: '#FFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    flex: 1,
  },
  dashboardSection: {
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: '#1E1E1E',
    width: '31%',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  statNum: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#AAA',
    fontSize: 10,
    marginTop: 4,
  },
  activityContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  logItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingVertical: 8,
  },
  logText: {
    color: '#CCC',
    fontSize: 12,
  },
  createContainer: {
    flexDirection: 'row',
    paddingBottom: 16,
    alignItems: 'center',
  },
  createButton: {
    backgroundColor: '#007BFF',
    padding: 14,
    borderRadius: 8,
    marginLeft: 10,
  },
  createButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default HomeScreen;
