import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5001', {
      withCredentials: true
    });

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const joinProject = (projectId) => {
    if (socket) {
      socket.emit('join-project', projectId);
    }
  };

  const leaveProject = (projectId) => {
    if (socket) {
      socket.emit('leave-project', projectId);
    }
  };

  const emitRoomUpdate = (data) => {
    if (socket) {
      socket.emit('room-update', data);
    }
  };

  const value = {
    socket,
    joinProject,
    leaveProject,
    emitRoomUpdate
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export default WebSocketContext;