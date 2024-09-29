
// socket
import { Server as SocketIOServer, Socket } from "socket.io";

export const socketHandler = (io: SocketIOServer) => 
  
  {

    console.log('1');
    
  io.on("connection", (socket: Socket) => {
    console.log("New client connected");
    console.log('2');

    socket.on("joinRoom", (chatId: string) => {
      console.log(`User joined room: ${chatId}`);
      socket.join(chatId);
    });
    console.log('3');

    socket.on("message", (messageData) => {
      console.log(messageData);
      console.log('4');

      console.log(`Message received in room ${messageData.chatId}:`, messageData);
    
      if (!messageData.chatId || !messageData.text) {
        console.log('5');

        console.error("Invalid message data:", messageData);
        return;
      }
      console.log('6');

      io.to(messageData.chatId).emit("message", messageData);
    });
    console.log('7');

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};
