import React, { useState, useEffect, createContext, useContext } from 'react';
import socketIOClient, { Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket;
}

const config = {
  url: import.meta.env.VITE_API_URL,
  options: {
    auth: {
      token: 'f55d2dc2-7f87-4259-8c6e-f2d16a33e5d7',
    },
  },
};

export const SocketContext = createContext<SocketContextType>({
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  socket: undefined!,
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const socket = socketIOClient(config.url, {
      auth: config.options.auth,
    });
    socket.connect();
    setSocket(socket);

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  if (!socket) {
    return null;
  }

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const { socket } = useContext(SocketContext);
  return socket;
}
