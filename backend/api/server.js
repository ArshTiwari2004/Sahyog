const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.io for real-time communication
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST']
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  logger.info(`New client connected: ${socket.id}`);
  
  socket.on('join_room', (data) => {
    socket.join(data.room);
    logger.info(`Client ${socket.id} joined room: ${data.room}`);
  });
  
  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Starting the server
server.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});