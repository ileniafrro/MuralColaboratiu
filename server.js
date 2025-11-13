const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));
app.use(express.json({ limit: '50mb' }));

const drawings = [];
let muralSnapshot = null;

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.emit('initial-drawings', drawings);

  socket.on('new-drawing', (drawingData) => {
    drawings.push({
      id: Date.now(),
      data: drawingData,
      timestamp: new Date()
    });

    io.emit('drawing-added', drawingData);
  });

  socket.on('request-mural-snapshot', () => {
    socket.emit('mural-snapshot', muralSnapshot);
  });

  socket.on('mural-updated', (snapshot) => {
    muralSnapshot = snapshot;
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
