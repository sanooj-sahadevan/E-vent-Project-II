import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import cookies from "js-cookie";
import { SOCKET_URI } from "@/utils/constansts";

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocket = () => useContext(SocketContext).socket;

const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const token = cookies.get("token");
    if (token) {
      const socketInstance = io(SOCKET_URI, {
        withCredentials: true,
        auth: { token },
      });

      socketInstance.on("connect", () => {
        console.log("Connected to socket");
        setSocket(socketInstance);
      });

      socketInstance.on("disconnect", () => {
        console.log("Disconnected from socket");
        setSocket(null);
      });

      return () => {
        socketInstance.disconnect();
      };
    }
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;