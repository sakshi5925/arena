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

  // Join a room by githubId or task room
  socket.on("join-room", ({ room, githubId }) => {
    socket.join(room);
    console.log(`${githubId} joined ${room}`);
  });

  // Send invitation to participants
  socket.on("send-task-invitation", ({ taskId, participants, from,slug }) => {
    console.log("the slug is ",slug);
    participants.forEach((githubId) => {
      io.to(githubId).emit("receive-task-invitation", {
        taskId,
        from,
        githubId,
        slug,
        receivedAt: new Date().toISOString(),
      });
      console.log(`Sent invitation to ${githubId} for task ${taskId}`);
    });
  });

  // Accept invitation listener — ADD THIS!
  socket.on("accept-task-invitation", ({ taskId, from, acceptedAt,slug ,githubId}) => {
    console.log(`Invitation accepted for task ${taskId} from ${from} at ${acceptedAt} to ${slug}`);
    // Optionally: notify task room or inviter user here
    // Example: io.to(taskId).emit("user-joined-task", { user: socket.id, taskId });
    socket.join(slug);
    io.to(slug).emit("room-updated", { slug, githubId, taskId });
  });
   socket.on("updateProgress", (data) => {
        io.to(data.slug).emit("progressUpdated", data);
      });

  // Disconnect 
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

httpServer.listen(4000, () => {
  console.log("Socket.io server running on port 4000");
});
