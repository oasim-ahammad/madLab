import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { DraxProvider, DraxView, DraxList } from 'react-native-drax';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useTasks } from '../hooks/useTasks';
import TaskCard from '../components/TaskCard';

const BoardScreen = ({ route, navigation }) => {
  const { boardId, boardName } = route.params;
  const { tasks, lists, fetchBoardData, moveTask } = useTasks(boardId);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchBoardData();
    });
    return unsubscribe;
  }, [navigation]);

  const renderTask = ({ item }) => {
    return (
      <DraxView
        style={styles.draggableCard}
        draggingStyle={styles.dragging}
        dragReleasedStyle={styles.dragging}
        hoverDraggingStyle={styles.hoverDragging}
        dragPayload={item}
        longPressDelay={150} // Wait 150ms before dragging so taps work
      >
        <TouchableOpacity 
           activeOpacity={0.8}
           onPress={() => navigation.navigate('TaskDetail', { task: item, boardId })}
        >
           <TaskCard task={item} />
        </TouchableOpacity>
      </DraxView>
    );
  };

  const onReceiveDragDrop = (event, targetList) => {
    const draggedTask = event.dragged.payload;
    if (draggedTask.listId !== targetList.id) {
      moveTask(draggedTask.id, targetList.id, targetList.name, draggedTask.name, 'Current Device User', targetList.name);
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <DraxProvider>
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
            {lists.map(list => {
              const listTasks = tasks.filter(t => t.listId === list.id);
              return (
                <DraxView
                  key={list.id}
                  style={styles.listContainer}
                  receivingStyle={styles.receivingZone}
                  onReceiveDragDrop={(event) => onReceiveDragDrop(event, list)}
                >
                  <Text style={styles.listTitle}>{list.name} ({listTasks.length})</Text>
                  <DraxList
                    data={listTasks}
                    renderItemContent={renderTask}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                  />
                </DraxView>
              );
            })}
          </ScrollView>
        </SafeAreaView>
      </DraxProvider>
    </GestureHandlerRootView>
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
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 20,
  },
  draggableCard: {
    marginBottom: 10,
  },
  dragging: {
    opacity: 0.2,
  },
  hoverDragging: {
    borderColor: '#007BFF',
    borderWidth: 2,
    opacity: 1,
    transform: [{ scale: 1.05 }],
  }
});

export default BoardScreen;
