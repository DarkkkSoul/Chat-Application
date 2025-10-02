import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  }
});

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

const ROOM ="group";

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);
  // adding an event listener => joinRoom which is emitted from the frontend
  socket.on("joinRoom", async (userName) => {
    console.log(`${userName} joined the room`);
    // joining the user into room
    await socket.join(ROOM);
    // emitting the event roomNotice to frontend
    socket.to(ROOM).emit("roomNotice",userName);
  })
});

server.listen(8989, () => {
  console.log('server running at http://localhost:8989');
});