import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import cors from 'cors';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// In-memory room storage
const rooms = new Map();

function getRoom(roomId) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, {
      id: roomId,
      clients: new Set(),
      segments: [],
      createdAt: new Date().toISOString(),
    });
  }
  return rooms.get(roomId);
}

function broadcast(room, message, excludeClient = null) {
  const data = JSON.stringify(message);
  room.clients.forEach(client => {
    if (client !== excludeClient && client.readyState === 1) {
      client.send(data);
    }
  });
}

// REST API for rooms
app.get('/api/rooms/:roomId', (req, res) => {
  const room = getRoom(req.params.roomId);
  res.json({
    id: room.id,
    segmentCount: room.segments.length,
    createdAt: room.createdAt,
    clients: room.clients.size,
  });
});

app.post('/api/rooms/:roomId/sync', (req, res) => {
  const room = getRoom(req.params.roomId);
  const { segment } = req.body;
  if (segment) {
    room.segments.push(segment);
    broadcast(room, { type: 'segment', segment });
  }
  res.json({ success: true, segmentCount: room.segments.length });
});

// WebSocket for real-time collaboration
wss.on('connection', (ws, req) => {
  const url = new URL(req.url, 'http://localhost');
  const roomId = url.searchParams.get('room') || 'default';
  const room = getRoom(roomId);
  
  room.clients.add(ws);
  console.log(`Client joined room ${roomId}. Total: ${room.clients.size}`);
  
  // Send existing segments to new client
  ws.send(JSON.stringify({
    type: 'history',
    segments: room.segments,
    roomId,
  }));
  
  // Notify others that someone joined
  broadcast(room, {
    type: 'presence',
    count: room.clients.size,
  }, ws);
  
  ws.on('message', (rawData) => {
    try {
      const msg = JSON.parse(rawData.toString());
      
      if (msg.type === 'segment') {
        // Store and broadcast new transcript segment
        const segment = {
          ...msg.segment,
          timestamp: msg.segment.timestamp || Date.now(),
        };
        room.segments.push(segment);
        broadcast(room, { type: 'segment', segment }, ws);
      }
      else if (msg.type === 'typing') {
        // Broadcast typing indicator
        broadcast(room, {
          type: 'typing',
          user: msg.user,
          text: msg.text,
        }, ws);
      }
      else if (msg.type === 'edit') {
        // Edit an existing segment
        const idx = room.segments.findIndex(s => s.id === msg.segmentId);
        if (idx !== -1) {
          room.segments[idx] = { ...room.segments[idx], ...msg.updates };
          broadcast(room, {
            type: 'edit',
            segmentId: msg.segmentId,
            updates: msg.updates,
          }, ws);
        }
      }
      else if (msg.type === 'delete') {
        // Delete a segment
        room.segments = room.segments.filter(s => s.id !== msg.segmentId);
        broadcast(room, {
          type: 'delete',
          segmentId: msg.segmentId,
        }, ws);
      }
      else if (msg.type === 'ping') {
        ws.send(JSON.stringify({ type: 'pong' }));
      }
    } catch (err) {
      console.error('WS message error:', err.message);
    }
  });
  
  ws.on('close', () => {
    room.clients.delete(ws);
    console.log(`Client left room ${roomId}. Total: ${room.clients.size}`);
    broadcast(room, {
      type: 'presence',
      count: room.clients.size,
    });
    
    // Clean up empty rooms after 24 hours
    if (room.clients.size === 0 && room.segments.length === 0) {
      setTimeout(() => {
        if (room.clients.size === 0 && room.segments.length === 0) {
          rooms.delete(roomId);
        }
      }, 86400000);
    }
  });
  
  ws.on('error', (err) => {
    console.error('WS error:', err.message);
    room.clients.delete(ws);
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', rooms: rooms.size, uptime: process.uptime() });
});

// Serve static client
app.use(express.static(path.join(__dirname, 'static')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'static/index.html'));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Constance server running on http://0.0.0.0:${PORT}`);
  console.log(`WebSocket: ws://0.0.0.0:${PORT}/ws?room=YOUR_ROOM_CODE`);
});
