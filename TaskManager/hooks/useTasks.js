import { useState, useCallback } from 'react';
import { getTasks, saveTask, updateTaskStatus, deleteTask, getLists } from '../storage/storageService';
import { logActivity } from '../utils/activityLog';

export const useTasks = (boardId) => {
  const [tasks, setTasks] = useState([]);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBoardData = useCallback(async () => {
    setLoading(true);
    const boardLists = await getLists(boardId);
    const boardTasks = await getTasks(boardId);
    
    // Sort lists by order
    boardLists.sort((a, b) => a.order - b.order);
    
    setLists(boardLists);
    setTasks(boardTasks);
    setLoading(false);
  }, [boardId]);

  const addTask = async (taskData, owner) => {
    const newTask = {
      id: `task-${Date.now()}`,
      boardId,
      ...taskData,
    };
    await saveTask(newTask);
    await logActivity(newTask.id, owner, 'added', newTask.name);
    await fetchBoardData();
    return newTask;
  };

  const moveTask = async (taskId, newListId, newStatus, taskName, owner, columnName) => {
    await updateTaskStatus(taskId, newListId, newStatus);
    await logActivity(taskId, owner, 'moved', taskName, columnName);
    await fetchBoardData();
  };

  const removeTask = async (taskId, taskName, owner) => {
    await deleteTask(taskId);
    await logActivity(taskId, owner, 'deleted', taskName);
    await fetchBoardData();
  };
  
  const editTask = async (task, owner) => {
      await saveTask(task);
      if(task.status === 'Completed') {
          await logActivity(task.id, owner, 'completed', task.name);
      } else {
          await logActivity(task.id, owner, 'updated', task.name);
      }
      await fetchBoardData();
  }

  return {
    tasks,
    lists,
    loading,
    fetchBoardData,
    addTask,
    moveTask,
    removeTask,
    editTask
  };
};
