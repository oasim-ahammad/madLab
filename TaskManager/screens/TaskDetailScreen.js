import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useTasks } from '../hooks/useTasks';
import { getLists, getActivityLogs, getComments, saveComment } from '../storage/storageService';
import { scheduleTaskDeadlines } from '../notifications/notificationService';

const TaskDetailScreen = ({ route, navigation }) => {
  const { task, boardId, isNew } = route.params || {};
  const { addTask, editTask, removeTask } = useTasks(boardId);
  const owner = "Current Device User";

  const [name, setName] = useState(task?.name || '');
  const [description, setDescription] = useState(task?.description || '');
  const [requiredTime, setRequiredTime] = useState(task?.requiredTime?.toString() || '1');
  const [deadline, setDeadline] = useState(task?.deadline || new Date(Date.now() + 86400000).toISOString());
  const [priority, setPriority] = useState(task ? task.priority : 'Medium');
  const [status, setStatus] = useState(task ? task.status : 'Pending');
  const [listId, setListId] = useState(task ? task.listId : null);
  const [membersStr, setMembersStr] = useState(task && task.members ? task.members.join(', ') : owner);
  
  const [deadlineStr, setDeadlineStr] = useState(task?.deadline ? task.deadline.split('T')[0] : new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  
  const calculateRemainingTime = (deadlineDate) => {
    const end = new Date(deadlineDate);
    const now = new Date();
    const diff = end - now;
    if (diff <= 0) return 'Overdue';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h left`;
  };
  
  const [lists, setLists] = useState([]);
  const [logs, setLogs] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchMetadata = async () => {
      const boardLists = await getLists(boardId);
      setLists(boardLists);
      if (isNew && boardLists.length > 0) {
        setListId(boardLists[0].id);
        setStatus(boardLists[0].name);
      }
      
      if (!isNew && task) {
          const fetchedLogs = await getActivityLogs(task.id);
          const fetchedComments = await getComments(task.id);
          setLogs(fetchedLogs.reverse());
          setComments(fetchedComments);
      }
    };
    fetchMetadata();
  }, [boardId, isNew, task]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Task name is required');
      return;
    }

    const membersArray = membersStr.split(',').map(m => m.trim()).filter(m => m.length > 0);
    if (membersArray.length === 0) membersArray.push(owner);

    let finalDeadline = deadline;
    if (deadlineStr && deadlineStr.length === 10) {
       finalDeadline = new Date(deadlineStr).toISOString();
    }

    const taskData = {
      name,
      description,
      requiredTime: requiredTime.trim() || '1 Hour', // Keep as string format
      deadline: finalDeadline,
      priority,
      status,
      listId,
      owner,
      members: membersArray,
    };

    if (isNew) {
      taskData.startDate = new Date().toISOString();
      const createdTask = await addTask(taskData, owner);
      await scheduleTaskDeadlines(createdTask);
    } else {
      const updatedTask = { ...task, ...taskData };
      await editTask(updatedTask, owner);
      await scheduleTaskDeadlines(updatedTask);
    }
    
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert('Confirm Delete', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
          await removeTask(task.id, task.name, owner);
          navigation.goBack();
      }}
    ]);
  };
  
  const handleAddComment = async () => {
      if(!newComment.trim() || isNew) return;
      const comment = {
          id: `comment-${Date.now()}`,
          taskId: task.id,
          owner,
          text: newComment,
          timestamp: new Date().toISOString()
      };
      await saveComment(comment);
      setComments([...comments, comment]);
      setNewComment('');
  };

  const priorities = ['Low', 'Medium', 'High'];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
         <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>Cancel</Text>
         </TouchableOpacity>
         <Text style={styles.headerTitle}>{isNew ? 'New Task' : 'Edit Task'}</Text>
         <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveText}>Save</Text>
         </TouchableOpacity>
      </View>

      <ScrollView style={styles.form}>
        <Text style={styles.label}>Task Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholderTextColor="#888" placeholder="e.g. Design UI" />

        <View style={styles.readOnlyContainer}>
          <Text style={styles.label}>Owner</Text>
          <Text style={styles.readOnlyText}>{owner}</Text>
        </View>

        {!isNew && task?.startDate && (
          <View style={styles.readOnlyContainer}>
            <Text style={styles.label}>Start Date</Text>
            <Text style={styles.readOnlyText}>{new Date(task.startDate).toLocaleDateString()}</Text>
          </View>
        )}

        <Text style={styles.label}>Required Time (e.g. 2 Hours, 5 Days)</Text>
        <TextInput 
          style={styles.input} 
          value={requiredTime} 
          onChangeText={setRequiredTime} 
          placeholderTextColor="#888" 
          placeholder="e.g. 5 Days" 
        />

        <Text style={styles.label}>Deadline (YYYY-MM-DD)</Text>
        <TextInput 
          style={styles.input} 
          value={deadlineStr} 
          onChangeText={setDeadlineStr} 
          onBlur={() => {
             if (deadlineStr.length === 10) {
                 const parsed = new Date(deadlineStr);
                 if (!isNaN(parsed)) {
                     setDeadline(parsed.toISOString());
                 }
             }
          }}
          placeholderTextColor="#888" 
          placeholder="YYYY-MM-DD" 
        />

        {!isNew && deadline && (
          <View style={styles.readOnlyContainer}>
            <Text style={styles.label}>Remaining Time</Text>
            <Text style={styles.readOnlyText}>{calculateRemainingTime(deadline)}</Text>
          </View>
        )}

        <Text style={styles.label}>Description</Text>
        <TextInput style={[styles.input, { height: 80 }]} value={description} onChangeText={setDescription} placeholderTextColor="#888" placeholder="Task details..." multiline />

        <Text style={styles.label}>Members (comma separated)</Text>
        <TextInput style={styles.input} value={membersStr} onChangeText={setMembersStr} placeholderTextColor="#888" placeholder="Alice, Bob, Charlie" />



        <Text style={styles.label}>Priority</Text>
        <View style={styles.buttonGroup}>
          {priorities.map(p => (
            <TouchableOpacity 
               key={p} 
               style={[styles.groupButton, priority === p && styles.groupButtonActive]}
               onPress={() => setPriority(p)}
            >
              <Text style={styles.groupButtonText}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Status (Column)</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.buttonGroupScroll}>
          {lists.map(list => (
            <TouchableOpacity 
               key={list.id} 
               style={[styles.groupButton, listId === list.id && styles.groupButtonActive]}
               onPress={() => {
                   setListId(list.id);
                   setStatus(list.name);
               }}
            >
              <Text style={styles.groupButtonText}>{list.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        {!isNew && (
            <>
                <Text style={styles.sectionTitle}>Comments</Text>
                {comments.map(c => (
                    <View key={c.id} style={styles.commentBox}>
                        <Text style={styles.commentOwner}>{c.owner} <Text style={styles.commentTime}>{new Date(c.timestamp).toLocaleDateString()}</Text></Text>
                        <Text style={styles.commentText}>{c.text}</Text>
                    </View>
                ))}
                <View style={styles.addCommentBox}>
                    <TextInput style={styles.commentInput} value={newComment} onChangeText={setNewComment} placeholder="Add a comment..." placeholderTextColor="#888" />
                    <TouchableOpacity style={styles.commentBtn} onPress={handleAddComment}>
                        <Text style={styles.commentBtnText}>Post</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>Activity History</Text>
                {logs.map(log => (
                    <Text key={log.id} style={styles.logText}>{log.message}</Text>
                ))}

                <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                   <Text style={styles.deleteText}>Delete Task</Text>
                </TouchableOpacity>
            </>
        )}
        <View style={{height: 50}} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { padding: 16, flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#333' },
  backText: { color: '#007BFF', fontSize: 16 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  saveText: { color: '#28A745', fontSize: 16, fontWeight: 'bold' },
  form: { padding: 16 },
  label: { color: '#AAA', marginBottom: 8, fontSize: 14, fontWeight: 'bold' },
  input: { backgroundColor: '#1E1E1E', color: '#FFF', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#333', marginBottom: 16 },
  readOnlyContainer: { marginBottom: 16 },
  readOnlyText: { color: '#FFF', fontSize: 16, padding: 12, backgroundColor: '#1E1E1E', borderRadius: 8, borderWidth: 1, borderColor: '#333', opacity: 0.7 },
  buttonGroup: { flexDirection: 'row', marginBottom: 16 },
  buttonGroupScroll: { flexDirection: 'row', marginBottom: 16 },
  groupButton: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#1E1E1E', borderRadius: 8, marginRight: 8, borderWidth: 1, borderColor: '#333' },
  groupButtonActive: { backgroundColor: '#007BFF', borderColor: '#007BFF' },
  groupButtonText: { color: '#FFF', fontWeight: 'bold' },
  sectionTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginTop: 24, marginBottom: 12 },
  commentBox: { backgroundColor: '#1E1E1E', padding: 12, borderRadius: 8, marginBottom: 8 },
  commentOwner: { color: '#007BFF', fontWeight: 'bold', marginBottom: 4 },
  commentTime: { color: '#888', fontWeight: 'normal', fontSize: 10 },
  commentText: { color: '#FFF' },
  addCommentBox: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  commentInput: { flex: 1, backgroundColor: '#1E1E1E', color: '#FFF', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#333' },
  commentBtn: { backgroundColor: '#007BFF', padding: 12, borderRadius: 8, marginLeft: 8 },
  commentBtnText: { color: '#FFF', fontWeight: 'bold' },
  logText: { color: '#AAA', fontSize: 12, marginBottom: 4 },
  deleteButton: { backgroundColor: '#DC3545', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 32 },
  deleteText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});

export default TaskDetailScreen;
