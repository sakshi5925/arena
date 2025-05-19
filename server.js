import { createServer } from "http";
import { Server } from "socket.io";
const httpServer = createServer();

const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });
  io.on("connection", (socket) => {
      console.log("New client connected:", socket.id);
      socket.on("join-room",({room,githubId})=>{
        socket.join(room);
        console.log(`${githubId} joined ${room}`);
      });
      socket.on("send-task-invitation",({taskId, participants, from})=>{
        participants.forEach((githubId) => {
            io.to(githubId).emit("receive-task-invitation",{
                taskId,
                from,
            })
        });
       
      })
      socket.on("disconnect",()=>{
         console.log("A user disconnected:", socket.id);
      })
      
});

httpServer.listen(4000, () => {
  console.log("Socket.io server running on port 4000");
});