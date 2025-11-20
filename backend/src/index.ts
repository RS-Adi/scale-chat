import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

const app = express();
app.use(cors());

// Create HTTP server first (needed for Socket.io later)
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('send_message', (data) => {
        console.log(`Message from ${socket.id}:`, data);
        io.emit('receive_message', data);
    });

    socket.on('disconnect', () => {
        console.log(`User Disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 4000;

app.get('/health', (req, res) => {
    res.json({ status: 'OK', uptime: process.uptime() });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
