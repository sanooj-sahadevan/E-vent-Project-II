
// socket
import { Server as SocketIOServer, Socket } from "socket.io";

export const socketHandler = (io: SocketIOServer) => {
  io.on("connection", (socket: Socket) => {
    console.log("New client connected");
    socket.on("joinRoom", (id: string) => {
      console.log(`User joined room: ${id}`);
      socket.join(id);
    });

    socket.on("message", (messageData) => {
      if (!messageData.chatId || !messageData.text) {
        console.error("Invalid message data:", messageData);
        return;
      }
      console.log('gointg to emit');

      io.to(messageData.chatId).emit("message", messageData);
    });


    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};


// const socketHandler = (io) => {
//   io.on("connection", (socket) => {
//     console.log("A user connected with socket ID:", socket.id);

//     socket.on("joinRoom", (chatId) => {
//       console.log(`Socket ${socket.id} joining room ${chatId}`);
//       socket.join(chatId);
//     });

//     socket.on("message", (messageData) => {
//       console.log("Message received:", messageData);
//       if (!messageData.chatId || !messageData.text) {
//         console.error("Invalid message data:", messageData);
//         return;
//       }
//       io.to(messageData.chatId).emit("message", messageData);
//     });

//     socket.on("disconnect", () => {
//       console.log("A user disconnected");
//     });
//   });
// };

// module.exports = socketHandler;