import express from 'express';
import http from 'http';
import Server from 'socket.io';
//import { Server as SocketIOServer } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } }); // cors only for testing in the example!

// Serve static files from the 'public' folder
app.use(express.static('public'));


// Handle client connections
io.on('connection', (socket) => {
  console.log('Client connected');

  // Handle messages from the client
  socket.on('message', (message) => {
    //console.log('Message received:', message);

    // Send message to all clients, including the one that sent the message
    io.emit('message', message);
  });

  // Handle messages from the client
  socket.on('voice', (voice) => {
    //console.log('Message received:', message);

    // Send message to all clients, including the one that sent the message
    io.emit('voice', voice);
  });

  // Handle disconnections
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Socket.IO server started at http://localhost:${PORT}`);
});