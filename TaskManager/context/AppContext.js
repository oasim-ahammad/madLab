import React, { createContext, useState, useEffect } from 'react';
import { getBoards, saveBoard, deleteBoard } from '../storage/storageService';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBoards = async () => {
    setLoading(true);
    const data = await getBoards();
    setBoards(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  const addBoard = async (boardData) => {
    const newBoard = {
      id: `board-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...boardData
    };
    await saveBoard(newBoard);
    await fetchBoards();
    return newBoard;
  };

  const removeBoard = async (boardId) => {
    await deleteBoard(boardId);
    await fetchBoards();
  };

  return (
    <AppContext.Provider value={{ boards, loading, addBoard, removeBoard, fetchBoards }}>
      {children}
    </AppContext.Provider>
  );
};
