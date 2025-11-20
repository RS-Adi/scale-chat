import express from 'express';
import http from 'http';
import cors from 'cors';

const app = express();
app.use(cors());

// Create HTTP server first (needed for Socket.io later)
const server = http.createServer(app);

const PORT = process.env.PORT || 4000;

app.get('/health', (req, res) => {
    res.json({ status: 'OK', uptime: process.uptime() });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
