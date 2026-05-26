import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { getAllTasks } from '../storage/storageService';
import TaskCard from '../components/TaskCard';

const TaskListScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filters
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadTasks();
    }
  }, [isFocused]);

  const loadTasks = async () => {
    const fetchedTasks = await getAllTasks();
    setTasks(fetchedTasks);
  };

  const getFilteredAndSortedTasks = () => {
    let filtered = tasks;
    
    if (searchQuery) {
      filtered = filtered.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (priorityFilter !== 'All') {
      filtered = filtered.filter(t => t.priority === priorityFilter);
    }
    if (statusFilter !== 'All') {
      filtered = filtered.filter(t => {
        if (statusFilter === 'Completed') return t.status === 'Completed';
        if (statusFilter === 'Pending') return t.status !== 'Completed';
        return true; // fallback
      });
    }
    
    // Sort by nearest deadline
    return filtered.sort((a, b) => {
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });
  };

  const renderFilterButtons = (currentFilter, setFilter, options) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
      {options.map(opt => (
        <TouchableOpacity
          key={opt}
          style={[styles.filterBtn, currentFilter === opt && styles.filterBtnActive]}
          onPress={() => setFilter(opt)}
        >
          <Text style={styles.filterBtnText}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Tasks</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search tasks..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filtersContainer}>
        <Text style={styles.filterLabel}>Priority:</Text>
        {renderFilterButtons(priorityFilter, setPriorityFilter, ['All', 'High', 'Medium', 'Low'])}
        
        <Text style={styles.filterLabel}>Status:</Text>
        {renderFilterButtons(statusFilter, setStatusFilter, ['All', 'Pending', 'Completed'])}
      </View>

      <FlatList
        data={getFilteredAndSortedTasks()}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => navigation.navigate('TaskDetail', { task: item, boardId: item.boardId })}
          >
             <TaskCard task={item} />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📝</Text>
            <Text style={styles.emptyText}>No tasks match your filters.</Text>
          </View>
        }
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
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  input: {
    backgroundColor: '#1E1E1E',
    color: '#FFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  filterLabel: {
    color: '#AAA',
    fontSize: 12,
    marginTop: 8,
    marginBottom: 4,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterBtn: {
    backgroundColor: '#1E1E1E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  filterBtnActive: {
    backgroundColor: '#007BFF',
    borderColor: '#007BFF',
  },
  filterBtnText: {
    color: '#FFF',
    fontSize: 12,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default TaskListScreen;
