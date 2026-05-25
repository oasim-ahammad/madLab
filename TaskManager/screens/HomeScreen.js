import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { AppContext } from '../context/AppContext';
import BoardCard from '../components/BoardCard';
import { initializeDefaultLists } from '../storage/storageService';

const HomeScreen = ({ navigation }) => {
  const { boards, addBoard, removeBoard } = useContext(AppContext);
  const [newBoardName, setNewBoardName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateBoard = async () => {
    if (newBoardName.trim().length === 0) return;
    const board = await addBoard({ name: newBoardName });
    await initializeDefaultLists(board.id);
    setNewBoardName('');
  };

  const filteredBoards = boards.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Boards</Text>
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

      <FlatList
        data={filteredBoards}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <BoardCard 
            board={item} 
            onPress={() => navigation.navigate('Board', { boardId: item.id, boardName: item.name })}
            onDelete={() => removeBoard(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>No boards found.</Text>}
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
  createContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
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
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default HomeScreen;
