import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Alert, FlatList } from 'react-native';
import { useTasks } from '../hooks/useTasks';
import TaskCard from '../components/TaskCard';

const BoardScreen = ({ route, navigation }) => {
  const { boardId, boardName } = route.params;
  const { tasks, lists, fetchBoardData, moveTask, addList, removeList, renameList } = useTasks(boardId);
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListName, setNewListName] = useState('');
  
  const [editingListId, setEditingListId] = useState(null);
  const [editingListName, setEditingListName] = useState('');

  const handleAddList = async () => {
    if (newListName.trim()) {
      await addList(newListName.trim());
      setNewListName('');
      setIsAddingList(false);
    }
  };

  const handleDeleteList = (listId, listName) => {
    Alert.alert('Delete List', `Are you sure you want to delete "${listName}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeList(listId) }
    ]);
  };
  
  const handleRenameList = async (list) => {
    if (editingListName.trim() && editingListName !== list.name) {
      await renameList(list, editingListName.trim());
    }
    setEditingListId(null);
    setEditingListName('');
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchBoardData();
    });
    return unsubscribe;
  }, [navigation]);

  const handleExplicitMove = (task, currentIndex, direction) => {
    const targetIndex = currentIndex + direction;
    if (targetIndex >= 0 && targetIndex < lists.length) {
      const targetList = lists[targetIndex];
      moveTask(task.id, targetList.id, targetList.name, task.name, 'Current Device User', targetList.name);
    }
  };

  const renderTask = (item, listIndex) => {
    return (
      <View style={styles.draggableCard}>
        <TouchableOpacity 
           activeOpacity={0.8}
           onPress={() => navigation.navigate('TaskDetail', { task: item, boardId })}
        >
           <TaskCard 
             task={item} 
             onMoveLeft={listIndex > 0 ? () => handleExplicitMove(item, listIndex, -1) : null}
             onMoveRight={listIndex < lists.length - 1 ? () => handleExplicitMove(item, listIndex, 1) : null}
           />
        </TouchableOpacity>
      </View>
    );
  };


  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{boardName}</Text>
            <TouchableOpacity 
               style={styles.addButton}
               onPress={() => navigation.navigate('TaskDetail', { boardId, isNew: true })}
            >
              <Text style={styles.addText}>+ Task</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal pagingEnabled={false} style={styles.boardScroll}>
            {lists.map((list, index) => {
              const listTasks = tasks.filter(t => t.listId === list.id);
              return (
                <View
                  key={list.id}
                  style={styles.listContainer}
                >
                  <View style={styles.listHeader}>
                    {editingListId === list.id ? (
                      <TextInput 
                         style={styles.renameInput}
                         value={editingListName}
                         onChangeText={setEditingListName}
                         autoFocus
                         onBlur={() => handleRenameList(list)}
                         onSubmitEditing={() => handleRenameList(list)}
                      />
                    ) : (
                      <TouchableOpacity onLongPress={() => {
                         setEditingListId(list.id);
                         setEditingListName(list.name);
                      }}>
                         <Text style={styles.listTitle}>{list.name} ({listTasks.length})</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={() => handleDeleteList(list.id, list.name)}>
                      <Text style={styles.deleteListText}>X</Text>
                    </TouchableOpacity>
                  </View>
                  <FlatList
                    data={listTasks}
                    renderItem={({ item }) => renderTask(item, index)}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                      <View style={styles.emptyList}>
                         <Text style={styles.emptyListIcon}>📂</Text>
                         <Text style={styles.emptyListText}>No tasks here. Use the buttons or create a new task.</Text>
                      </View>
                    }
                  />
                </View>
              );
            })}
            
            {/* Add List Section */}
            <View style={styles.listContainer}>
              {isAddingList ? (
                <View>
                  <TextInput
                    style={styles.addListInput}
                    value={newListName}
                    onChangeText={setNewListName}
                    placeholder="List Name"
                    placeholderTextColor="#888"
                    autoFocus
                  />
                  <View style={styles.addListActions}>
                    <TouchableOpacity style={styles.addListBtn} onPress={handleAddList}>
                      <Text style={styles.addListBtnText}>Add</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelListBtn} onPress={() => { setIsAddingList(false); setNewListName(''); }}>
                      <Text style={styles.cancelListBtnText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <TouchableOpacity style={styles.addListTrigger} onPress={() => setIsAddingList(true)}>
                  <Text style={styles.addListTriggerText}>+ Add List</Text>
                </TouchableOpacity>
              )}
            </View>

          </ScrollView>
        </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  boardScroll: {
    flex: 1,
    padding: 16,
  },
  listContainer: {
    width: 300,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    marginRight: 16,
    padding: 12,
  },
  receivingZone: {
    borderColor: '#007BFF',
    borderWidth: 2,
  },
  listTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  deleteListText: {
    color: '#DC3545',
    fontWeight: 'bold',
    fontSize: 16,
    paddingHorizontal: 8,
  },
  addListInput: {
    backgroundColor: '#121212',
    color: '#FFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 10,
  },
  addListActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addListBtn: {
    backgroundColor: '#28A745',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  addListBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  cancelListBtn: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  cancelListBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  addListTrigger: {
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#555',
  },
  addListTriggerText: {
    color: '#AAA',
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  draggableCard: {
    marginBottom: 10,
  },
  renameInput: {
    flex: 1,
    backgroundColor: '#121212',
    color: '#FFF',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#007BFF',
  },
  emptyList: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 20,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
  },
  emptyListIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  emptyListText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 12,
  }
});

export default BoardScreen;
