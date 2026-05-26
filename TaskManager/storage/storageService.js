import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  BOARDS: '@boards',
  LISTS: '@lists',
  TASKS: '@tasks',
  COMMENTS: '@comments',
  ACTIVITY_LOGS: '@activity_logs',
};

// Boards
export const getBoards = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.BOARDS);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error getting boards:', e);
    return [];
  }
};

export const saveBoard = async (board) => {
  try {
    const boards = await getBoards();
    boards.push(board);
    await AsyncStorage.setItem(STORAGE_KEYS.BOARDS, JSON.stringify(boards));
    return board;
  } catch (e) {
    console.error('Error saving board:', e);
  }
};

export const deleteBoard = async (boardId) => {
  try {
    const boards = await getBoards();
    const updatedBoards = boards.filter(b => b.id !== boardId);
    await AsyncStorage.setItem(STORAGE_KEYS.BOARDS, JSON.stringify(updatedBoards));
    // Optionally clean up related lists and tasks here
  } catch (e) {
    console.error('Error deleting board:', e);
  }
};

// Lists
export const getLists = async (boardId) => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.LISTS);
    const allLists = jsonValue != null ? JSON.parse(jsonValue) : [];
    return allLists.filter(list => list.boardId === boardId);
  } catch (e) {
    console.error('Error getting lists:', e);
    return [];
  }
};

export const saveList = async (list) => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.LISTS);
    const allLists = jsonValue != null ? JSON.parse(jsonValue) : [];
    const index = allLists.findIndex(l => l.id === list.id);
    if (index >= 0) {
      allLists[index] = list;
    } else {
      allLists.push(list);
    }
    await AsyncStorage.setItem(STORAGE_KEYS.LISTS, JSON.stringify(allLists));
    return list;
  } catch (e) {
    console.error('Error saving list:', e);
  }
};

export const deleteList = async (listId) => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.LISTS);
    const allLists = jsonValue != null ? JSON.parse(jsonValue) : [];
    const updatedLists = allLists.filter(l => l.id !== listId);
    await AsyncStorage.setItem(STORAGE_KEYS.LISTS, JSON.stringify(updatedLists));
  } catch (e) {
    console.error('Error deleting list:', e);
  }
};

// Tasks
export const getTasks = async (boardId) => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
    const allTasks = jsonValue != null ? JSON.parse(jsonValue) : [];
    return allTasks.filter(task => task.boardId === boardId);
  } catch (e) {
    console.error('Error getting tasks:', e);
    return [];
  }
};

export const getAllTasks = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error getting all tasks:', e);
    return [];
  }
};

export const saveTask = async (task) => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
    const allTasks = jsonValue != null ? JSON.parse(jsonValue) : [];
    const index = allTasks.findIndex(t => t.id === task.id);
    if (index >= 0) {
      allTasks[index] = task;
    } else {
      allTasks.push(task);
    }
    await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(allTasks));
    return task;
  } catch (e) {
    console.error('Error saving task:', e);
  }
};

export const updateTaskStatus = async (taskId, newListId, newStatus) => {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
        const allTasks = jsonValue != null ? JSON.parse(jsonValue) : [];
        const task = allTasks.find(t => t.id === taskId);
        if(task) {
            task.listId = newListId;
            task.status = newStatus;
            await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(allTasks));
        }
    } catch (e) {
        console.error('Error updating task status:', e);
    }
}

export const deleteTask = async (taskId) => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
    const allTasks = jsonValue != null ? JSON.parse(jsonValue) : [];
    const updatedTasks = allTasks.filter(t => t.id !== taskId);
    await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updatedTasks));
  } catch (e) {
    console.error('Error deleting task:', e);
  }
};

// Activity Logs
export const getActivityLogs = async (taskId) => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS);
    const allLogs = jsonValue != null ? JSON.parse(jsonValue) : [];
    return allLogs.filter(log => log.taskId === taskId);
  } catch (e) {
    console.error('Error getting activity logs:', e);
    return [];
  }
};

export const getAllActivityLogs = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error getting all activity logs:', e);
    return [];
  }
};

export const saveActivityLog = async (log) => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS);
    const allLogs = jsonValue != null ? JSON.parse(jsonValue) : [];
    allLogs.push(log);
    await AsyncStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(allLogs));
    return log;
  } catch (e) {
    console.error('Error saving activity log:', e);
  }
};

// Comments
export const getComments = async (taskId) => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.COMMENTS);
    const allComments = jsonValue != null ? JSON.parse(jsonValue) : [];
    return allComments.filter(comment => comment.taskId === taskId);
  } catch (e) {
    console.error('Error getting comments:', e);
    return [];
  }
};

export const saveComment = async (comment) => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.COMMENTS);
    const allComments = jsonValue != null ? JSON.parse(jsonValue) : [];
    allComments.push(comment);
    await AsyncStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(allComments));
    return comment;
  } catch (e) {
    console.error('Error saving comment:', e);
  }
};

export const initializeDefaultLists = async (boardId) => {
    const defaultLists = [
        { id: `list-todo-${Date.now()}`, boardId, name: 'Todo', order: 0 },
        { id: `list-doing-${Date.now()}`, boardId, name: 'Doing', order: 1 },
        { id: `list-review-${Date.now()}`, boardId, name: 'Review', order: 2 },
        { id: `list-completed-${Date.now()}`, boardId, name: 'Completed', order: 3 },
    ];
    for (const list of defaultLists) {
        await saveList(list);
    }
}
